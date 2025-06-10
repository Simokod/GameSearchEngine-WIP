function interpolateColor(color1: number[], color2: number[], factor: number) {
  return color1.map((c1, i) => Math.round(c1 + (color2[i] - c1) * factor));
}

// Map score (0-100) to a color: 0=red, 50=yellow, 100=green
function scoreToColor(score: number) {
  if (score <= 50) {
    const factor = score / 50;
    const rgb = interpolateColor([239, 68, 68], [250, 204, 21], factor);
    return `rgb(${rgb.join(",")})`;
  } else {
    const factor = (score - 50) / 50;
    const rgb = interpolateColor([250, 204, 21], [34, 197, 94], factor);
    return `rgb(${rgb.join(",")})`;
  }
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className="text-sm font-semibold px-3 py-1 rounded-full shadow-sm"
      style={{
        background: scoreToColor(score),
        color: "#fff",
        minWidth: 44,
        display: "inline-block",
        textAlign: "center",
      }}
    >
      {score.toFixed(1)}
    </span>
  );
}
