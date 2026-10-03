"""Read selected PNG/JSON members; never extract or execute a CI ZIP."""
import base64
import hashlib
import json
import os
from pathlib import PurePosixPath
import stat
import struct
import sys
import zipfile

MAX_ARCHIVE = 64 * 1024 * 1024
MAX_IMAGE = 3 * 1024 * 1024
MAX_SELECTED = 12 * 1024 * 1024


def read_evidence(archive_path, requested):
    if not isinstance(requested, list) or not 1 <= len(requested) <= 10:
        raise ValueError("invalid evidence selection")
    if any(not isinstance(name, str) for name in requested) or len(set(requested)) != len(requested):
        raise ValueError("invalid or duplicate evidence selection")
    if os.path.getsize(archive_path) > MAX_ARCHIVE:
        raise ValueError("archive exceeds byte limit")
    result = {}
    with zipfile.ZipFile(archive_path) as archive:
        members = archive.infolist()
        if len(members) > 200 or sum(m.file_size for m in members) > 128 * 1024 * 1024:
            raise ValueError("archive exceeds member or expansion limit")
        names = set()
        for member in members:
            path = PurePosixPath(member.filename)
            if (member.orig_filename != member.filename
                    or member.filename in names or path.is_absolute()
                    or ".." in path.parts or "\\" in member.filename
                    or ":" in member.filename or "\x00" in member.filename
                    or stat.S_ISLNK(member.external_attr >> 16)):
                raise ValueError("unsafe archive member")
            names.add(member.filename)
        total = 0
        for name in requested:
            if name not in names:
                raise ValueError("missing selected evidence")
            member = archive.getinfo(name)
            limit = MAX_IMAGE if name.endswith(".png") else 256 * 1024
            if member.is_dir() or member.file_size > limit:
                raise ValueError("selected evidence exceeds byte limit")
            with archive.open(member) as stream:
                data = stream.read(limit + 1)
            total += len(data)
            if len(data) > limit or total > MAX_SELECTED:
                raise ValueError("selected evidence exceeds byte limit")
            if name.endswith(".png"):
                if len(data) < 33 or data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
                    raise ValueError("selected image is not a PNG")
                width, height = struct.unpack(">II", data[16:24])
                if not (1 <= width <= 4096 and 1 <= height <= 8192 and width * height <= 12000000):
                    raise ValueError("PNG exceeds dimension limit")
                result[name] = {"data": base64.b64encode(data).decode("ascii"),
                                "bytes": len(data), "width": width, "height": height,
                                "sha256": hashlib.sha256(data).hexdigest()}
            elif name.endswith(".json"):
                result[name] = json.loads(data)
            else:
                raise ValueError("unsupported evidence format")
    return result


if __name__ == "__main__":
    try:
        print(json.dumps(read_evidence(sys.argv[1], json.loads(sys.argv[2]))))
    except Exception:
        print("Evidence archive failed validation", file=sys.stderr)
        sys.exit(1)
