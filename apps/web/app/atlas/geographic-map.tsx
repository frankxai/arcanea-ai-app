"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { atlasMap } from "@arcanea/design-system/tokens";
import {
  atlasAtMoment,
  type AtlasFeature,
  type GeographicAtlas,
} from "@arcanea/world-engine";
import styles from "./geographic-map.module.css";

function center(feature: AtlasFeature): [number, number] {
  if (feature.geometry.type === "Point") return feature.geometry.coordinates;
  const points = feature.geometry.coordinates.slice(0, -1);
  return [
    points.reduce((n, p) => n + p[0], 0) / points.length,
    points.reduce((n, p) => n + p[1], 0) / points.length,
  ];
}
const points = (feature: AtlasFeature) =>
  feature.geometry.type === "Polygon"
    ? feature.geometry.coordinates.map((p) => p.join(",")).join(" ")
    : "";
const number = new Intl.NumberFormat("en");

export default function GeographicMap({ atlas }: { atlas: GeographicAtlas }) {
  const id = useId();
  const [moment, setMoment] = useState(atlas.timeline.from);
  const [selectedId, setSelectedId] = useState(
    atlas.features.find((feature) => feature.kind === "region")?.entityId ?? "",
  );
  const [zoomed, setZoomed] = useState(false);
  const [showEarlier, setShowEarlier] = useState(true);
  const snapshot = useMemo(() => atlasAtMoment(atlas, moment), [atlas, moment]);
  const selected =
    snapshot.features.find((f) => f.entityId === selectedId) ??
    snapshot.features[0];
  const regions = snapshot.features.filter((f) => f.kind === "region");
  const zoomRegionId =
    selected?.kind === "region" ? selected.entityId : selected?.parentId;
  const visibleRegions = zoomed
    ? regions.filter((f) => f.entityId === zoomRegionId)
    : regions;
  const era = [...atlas.timeline.eras]
    .reverse()
    .find((e) => e.moment <= moment);
  const history = atlas.features
    .filter((f) => f.entityId === selected?.entityId)
    .sort((a, b) => a.validity.from - b.validity.from);
  const previous = atlas.features
    .filter(
      (f) =>
        f.kind === "region" &&
        f.validity.to !== null &&
        f.validity.to <= moment,
    )
    .filter(
      (f, i, all) =>
        !all.some(
          (other, j) =>
            j !== i &&
            other.entityId === f.entityId &&
            other.validity.from > f.validity.from,
        ),
    );

  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("moment");
      const value =
        raw !== null && /^\d+$/.test(raw) ? Number(raw) : atlas.timeline.from;
      const at =
        Number.isSafeInteger(value) &&
        value >= atlas.timeline.from &&
        value <= atlas.timeline.to
          ? value
          : atlas.timeline.from;
      const place = params.get("place");
      setMoment(at);
      if (
        place &&
        atlasAtMoment(atlas, at).features.some((f) => f.entityId === place)
      )
        setSelectedId(place);
    };
    const frame = requestAnimationFrame(restore);
    window.addEventListener("popstate", restore);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", restore);
    };
  }, [atlas]);

  function update(at: number, place = selected?.entityId) {
    setMoment(at);
    if (place) setSelectedId(place);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", "geography");
    url.searchParams.set("moment", String(at));
    if (place) url.searchParams.set("place", place);
    window.history.replaceState(null, "", url);
  }
  function viewBox() {
    if (!zoomed || !selected) return "70 50 860 540";
    const parent =
      selected.kind === "settlement"
        ? regions.find((r) => r.entityId === selected.parentId)
        : selected;
    if (parent?.geometry.type !== "Polygon") return "70 50 860 540";
    const xs = parent.geometry.coordinates.map((p) => p[0]),
      ys = parent.geometry.coordinates.map((p) => p[1]);
    return `${Math.min(...xs) - 50} ${Math.min(...ys) - 50} ${Math.max(...xs) - Math.min(...xs) + 100} ${Math.max(...ys) - Math.min(...ys) + 100}`;
  }

  return (
    <section className={styles.atlas} aria-labelledby={`${id}-heading`}>
      <header className={styles.heading}>
        <div>
          <p className={styles.kicker}>
            Fictional test fixture · Unapproved geography
          </p>
          <h2 id={`${id}-heading`}>A world, through time.</h2>
          <p>
            Follow a changing border. Find who was there. Keep every earlier
            survey.
          </p>
        </div>
        <a href="#atlas-inspector" className={styles.skip}>
          Skip to place details
        </a>
      </header>
      <div className={styles.layout}>
        <div className={styles.stage}>
          <div className={styles.toolbar}>
            <span>
              {atlas.title}{" "}
              <span className={styles.secondary}>/ Local survey</span>
            </span>
            <button
              type="button"
              onClick={() => setZoomed(!zoomed)}
              aria-pressed={zoomed}
            >
              {zoomed ? "Fit survey" : "Zoom to place"}
            </button>
          </div>
          <svg
            className={styles.map}
            viewBox={viewBox()}
            aria-labelledby={`${id}-map-title ${id}-map-desc`}
          >
            <title id={`${id}-map-title`}>
              Geographic survey at moment {moment}
            </title>
            <desc id={`${id}-map-desc`}>
              Two fictional regions and their ports. Select a shape or use the
              place selector below. Dashed outlines show an earlier boundary.
            </desc>
            <defs>
              <pattern
                id={`${id}-grid`}
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 50 0 L 0 0 0 50" className={styles.grid} />
              </pattern>
            </defs>
            <rect
              x="0"
              y="0"
              width="1000"
              height="640"
              fill={`url(#${id}-grid)`}
              aria-hidden="true"
            />
            <g aria-hidden="true" className={styles.compass}>
              <path d="M 895 115 L 895 65 M 883 83 L 895 65 907 83" />
              <text x="895" y="48" textAnchor="middle">
                N
              </text>
            </g>
            {visibleRegions.map((feature) => {
              const [x, y] = center(feature);
              return (
                <g key={feature.entityId}>
                  <polygon
                    points={points(feature)}
                    className={styles.region}
                    data-selected={
                      selected?.entityId === feature.entityId ||
                      selected?.parentId === feature.entityId
                    }
                    data-feature-id={feature.entityId}
                    data-version={feature.assertionId}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${feature.label}`}
                    aria-pressed={selected?.entityId === feature.entityId}
                    onClick={() => update(moment, feature.entityId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        update(moment, feature.entityId);
                      }
                    }}
                  />
                  <g aria-hidden="true" className={styles.contours}>
                    {atlasMap.contourScales.map((scale) => (
                      <polygon
                        key={scale}
                        points={points(feature)}
                        transform={`translate(${x * (1 - scale)} ${y * (1 - scale)}) scale(${scale})`}
                      />
                    ))}
                  </g>
                  <text
                    x={x}
                    y={y + atlasMap.regionLabelOffset}
                    textAnchor="middle"
                    className={styles.regionLabel}
                    aria-hidden="true"
                  >
                    {feature.label}
                  </text>
                  <text
                    x={x}
                    y={y + atlasMap.mobileRegionLabelOffset}
                    textAnchor="middle"
                    className={styles.mobileRegionLabel}
                    aria-hidden="true"
                  >
                    {feature.label.split(" ").map((word, index) => (
                      <tspan key={index} x={x} dy={index === 0 ? 0 : "1em"}>
                        {word}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
            {showEarlier &&
              previous
                .filter((f) => !zoomed || f.entityId === zoomRegionId)
                .map((f) => (
                  <polygon
                    key={f.assertionId}
                    points={points(f)}
                    className={styles.earlier}
                    aria-hidden="true"
                  />
                ))}
            {snapshot.features
              .filter(
                (f) =>
                  f.kind === "settlement" &&
                  (!zoomed || f.parentId === zoomRegionId),
              )
              .map((feature) => {
                const [x, y] = center(feature);
                const present = snapshot.presences.some(
                  (p) =>
                    p.placeId === feature.entityId && p.type === "character",
                );
                return (
                  <g
                    key={feature.entityId}
                    className={styles.port}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${feature.label}${present ? ", cartographer present" : ""}`}
                    aria-pressed={selected?.entityId === feature.entityId}
                    onClick={() => update(moment, feature.entityId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        update(moment, feature.entityId);
                      }
                    }}
                  >
                    <circle cx={x} cy={y} className={styles.hitArea} />
                    <circle
                      cx={x}
                      cy={y}
                      className={present ? styles.occupied : styles.unoccupied}
                    />
                    <text
                      x={x}
                      y={y + atlasMap.portLabelOffset}
                      textAnchor="middle"
                    >
                      {feature.label}
                    </text>
                  </g>
                );
              })}
          </svg>
          <div className={styles.legend}>
            <span>Solid line: current boundary</span>
            <label>
              <input
                type="checkbox"
                checked={showEarlier}
                onChange={(e) => setShowEarlier(e.target.checked)}
              />{" "}
              Earlier boundary
            </label>
            <span>Filled marker: character present</span>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timeHeading}>
              <label htmlFor={`${id}-moment`}>Story moment</label>
              <output htmlFor={`${id}-moment`} aria-live="polite">
                {number.format(moment)} · {era?.label}
              </output>
            </div>
            <input
              id={`${id}-moment`}
              name="moment"
              aria-label="Story moment"
              type="range"
              min={atlas.timeline.from}
              max={atlas.timeline.to}
              step="1"
              value={moment}
              onChange={(e) => update(Number(e.target.value))}
              aria-valuetext={`Moment ${moment}, ${era?.label}`}
            />
            <div className={styles.eras}>
              {atlas.timeline.eras.map((e) => (
                <button
                  key={e.moment}
                  type="button"
                  aria-pressed={era?.moment === e.moment}
                  onClick={() => update(e.moment)}
                >
                  <span>{number.format(e.moment)}</span>
                  {e.label}
                </button>
              ))}
            </div>
            <p className={styles.secondary}>
              Synthetic ordinal moments. These are not dates in Arcanea’s
              history.
            </p>
          </div>
        </div>
        <aside
          id="atlas-inspector"
          className={styles.inspector}
          aria-label="Place details"
        >
          <label htmlFor={`${id}-place`}>Explore a place</label>
          <select
            id={`${id}-place`}
            name="place"
            value={selected?.entityId ?? ""}
            onChange={(e) => update(moment, e.target.value)}
          >
            {snapshot.features.map((f) => (
              <option key={f.entityId} value={f.entityId}>
                {f.label} · {f.kind}
              </option>
            ))}
          </select>
          {selected ? (
            <>
              <p className={styles.kicker}>
                {selected.kind} · Fictional fixture
              </p>
              <h3>{selected.label}</h3>
              <p>{selected.description}</p>
              {selected.parentId && (
                <button
                  className={styles.textButton}
                  onClick={() => update(moment, selected.parentId!)}
                >
                  View parent region
                </button>
              )}
              <div className={styles.metadata}>
                <span>Active version</span>
                <strong>{selected.assertionId}</strong>
                <span>Valid moments</span>
                <strong>
                  {selected.validity.from} to{" "}
                  {selected.validity.to === null
                    ? "open end"
                    : `${selected.validity.to} (exclusive)`}
                </strong>
              </div>
              <h4>At this moment</h4>
              <ul className={styles.presences}>
                {snapshot.presences.map((p) => {
                  const place = snapshot.features.find(
                    (f) => f.entityId === p.placeId,
                  );
                  return (
                    <li key={p.assertionId}>
                      <button onClick={() => update(moment, p.placeId)}>
                        <span>
                          {p.type === "event" ? "Event" : "Character"}
                        </span>
                        <strong>{p.label}</strong>
                        <span>{place?.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {snapshot.presences.length === 0 && (
                <p>
                  No character or event locations are recorded at this moment.
                </p>
              )}
              <details className={styles.sources}>
                <summary>Source and version history</summary>
                <p>
                  Staging test data. Hashes identify fixture bytes; they do not
                  grant canon authority.
                </p>
                <p className={styles.identifier}>{selected.entityId}</p>
                <a href="https://github.com/frankxai/arcanea-ai-app/blob/agent/codex/timeline-geographic-atlas/packages/world-engine/fixtures/atlas-source.md">
                  Read fixture source
                </a>
                <code>{selected.source.sha256}</code>
                <ul>
                  {history.map((v) => (
                    <li key={v.assertionId}>
                      <button
                        onClick={() => update(v.validity.from, v.entityId)}
                      >
                        Moment {v.validity.from}: {v.assertionId}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </>
          ) : (
            <p>No geographic features are recorded at this moment.</p>
          )}
          <a
            className={styles.authority}
            href="https://github.com/frankxai/arcanea-ai-app/issues/283"
          >
            Realm Graph authority and continuity requirements
          </a>
        </aside>
      </div>
    </section>
  );
}
