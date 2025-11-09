import TokenDiscovery from "@/components/token-discovery";

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Token Discovery</h1>
      <p className="text-textMuted max-w-xl">
        Live prices, sorting, tooltips, popovers, modal, and smooth updates.
      </p>
      <TokenDiscovery />
    </div>
  );
}
