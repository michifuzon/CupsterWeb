export function Skeleton({ width = "100%", height = 16, radius = 8, style }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, display: "block", ...style }}
    />
  );
}

export function SkeletonCards({ count = 4, className = "grid-cards-centered" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div className="card" key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Skeleton height={90} radius={14} />
          <Skeleton height={14} width="70%" />
          <Skeleton height={12} width="40%" />
        </div>
      ))}
    </div>
  );
}
