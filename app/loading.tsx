export default function Loading() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="h-6 w-48 bg-hover animate-pulse rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-hover animate-pulse rounded"
          />
        ))}
      </div>
    </div>
  );
}
