# ComfyUI workflow integration

Use this procedure only when the task has an available, authorized ComfyUI
installation. It is an integration guide, not a bundled workflow or a running
image service. Another image tool can satisfy the collection brief without
installing ComfyUI.

## Establish the actual environment

Record the server location, owner, installed model/checkpoint, relevant custom
nodes, workflow source, available capacity and task budget. Keep credentials in
the host's secret mechanism. Do not start a GPU workload, install custom nodes or
download model weights merely because this reference mentions them.

For official Arcanea work, retain the current approved visual source. For
creator-owned work, use that creator's brief and references. Model names, LoRA
weights and conditioning settings must come from the working environment and
sample results.

## Export and inspect a working graph

Start with a workflow that already renders the intended sample in the installed
interface. Export its **API format** for programmatic submission; the ordinary
saved UI graph is a different format. Preserve the original export and record a
hash before adapting named inputs. Do not invent node ids or replace unsupported
nodes with guessed equivalents. See the official
[workflow API format guide](https://docs.comfy.org/development/api-development/workflow-api-format).

Inspect node definitions and required inputs, model availability, output nodes
and any external-service nodes. A downloaded workflow may require missing custom
nodes, credentials or models. Review those dependencies before executing it.

## Submit a bounded sample

The self-hosted server exposes node metadata through `GET /object_info`, accepts
workflows through `POST /prompt`, and provides job history through
`GET /history/{prompt_id}`. Validate the response and retain the returned prompt
id; queue acceptance is not proof of completed rendering. The official
[server routes reference](https://docs.comfy.org/development/comfyui-server/comms_routes)
describes these endpoints. Hosted adapters can use different authentication and
API contracts; inspect their own documentation.

Submit only the authorized sample size. Apply a timeout, track that exact job and
retrieve its actual output. Inspect the returned image against the brief before
planning a larger batch. On an uncertain response, inspect the same job before
resubmitting; do not create duplicate paid work to resolve an observation timeout.

## Review and reproduce

- Compare the output with the identity brief and selected traits.
- Record the exported workflow hash, actual changed inputs, model identifiers,
  supplied references, job id, output and review decision.
- Keep a record of failed candidates and the visible reason for each revision.
- Change one important variable at a time while testing consistency.
- Treat fixed seeds as a supported implementation setting, not a guarantee of
  identical results across hardware, software versions or providers.

No automated aesthetic, palette or uniqueness scorer is supplied by this skill.
If one is connected, record its implementation and calibration separately from
human visual review. Derive throughput and cost from the actual environment and
observed jobs; this guide contains no training-speed or price promise.

Stop only jobs and servers owned by this task. Preserve shared workers and other
users' jobs. If a required node, model or permission is absent, return the exact
dependency gap plus the usable brief and workflow preparation already completed.
