/**
 * Tiny chart maths. Enough to draw the console's curves and arcs without
 * pulling in a charting library (which would cost more than the whole page).
 */

/** Catmull-Rom through the points, emitted as cubic beziers. */
export function smoothPath(
  values: number[],
  width: number,
  height: number,
  max: number,
  padTop = 10,
) {
  const step = width / (values.length - 1);
  const points = values.map((value, index) => ({
    x: index * step,
    y: height - (value / max) * (height - padTop),
  }));

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return { line: d, area: `${d} L ${width} ${height} L 0 ${height} Z` };
}

/** Donut segments as stroke-dasharray offsets on a shared circle. */
export function donutSegments(values: number[], circumference: number) {
  const total = values.reduce((sum, value) => sum + value, 0);
  let offset = 0;

  return values.map((value) => {
    const length = (value / total) * circumference;
    const segment = { dash: length, gap: circumference - length, offset: -offset };
    offset += length;
    return segment;
  });
}
