"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div className="rounded-2xl border border-red-800 bg-red-900/20 p-4">
      <h2 className="text-red-400 font-semibold text-lg">
        Something went wrong
      </h2>
      <p className="text-sm opacity-80">{error.message}</p>
    </div>
  );
}
