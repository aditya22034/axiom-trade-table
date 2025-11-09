export type Token = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  chain: "ETH" | "BSC" | "SOL" | "BASE";
  tag: "New" | "Final Stretch" | "Migrated";
};

export const seed: Token[] = [
  {
    symbol: "AXM",
    name: "Axiom",
    price: 1.03,
    change: 2.4,
    volume: 12003450,
    marketCap: 230_000_000,
    chain: "ETH",
    tag: "New",
  },
  {
    symbol: "PULSE",
    name: "Pulse Net",
    price: 0.34,
    change: -1.3,
    volume: 5033450,
    marketCap: 75_000_000,
    chain: "BASE",
    tag: "New",
  },
  {
    symbol: "SOLX",
    name: "Sol X",
    price: 12.8,
    change: 0.6,
    volume: 90333450,
    marketCap: 1_530_000_000,
    chain: "SOL",
    tag: "Final Stretch",
  },
  {
    symbol: "BRDG",
    name: "BridgeFi",
    price: 2.1,
    change: -0.2,
    volume: 20033450,
    marketCap: 310_000_000,
    chain: "ETH",
    tag: "Migrated",
  },
  {
    symbol: "BNOVA",
    name: "B Nova",
    price: 0.89,
    change: 4.1,
    volume: 15033450,
    marketCap: 120_000_000,
    chain: "BSC",
    tag: "Final Stretch",
  },
  {
    symbol: "GAMMA",
    name: "Gamma",
    price: 4.67,
    change: 1.7,
    volume: 18033450,
    marketCap: 410_000_000,
    chain: "ETH",
    tag: "New",
  },
  {
    symbol: "ECHO",
    name: "Echo",
    price: 0.053,
    change: 0.9,
    volume: 8033450,
    marketCap: 50_000_000,
    chain: "BASE",
    tag: "Migrated",
  },
];

// ✅ WebSocket-like real-time price updates
class PriceBus extends EventTarget {
  start(tokens: Token[]) {
    setInterval(() => {
      const idx = Math.floor(Math.random() * tokens.length);
      const t = tokens[idx];

      const delta = (Math.random() - 0.5) * 0.02 * Math.max(1, t.price);
      t.price = Math.max(0.0001, +(t.price + delta).toFixed(4));

      t.change = +(t.change + (Math.random() - 0.5) * 0.5).toFixed(2);

      t.volume = Math.max(
        0,
        Math.round(t.volume + (Math.random() - 0.5) * 50000)
      );

      this.dispatchEvent(
        new CustomEvent("tick", {
          detail: { ...t },
        })
      );
    }, 1500);
  }
}

export const priceBus = new PriceBus();

// ✅ Mock API fetch
export async function fetchTokens(): Promise<Token[]> {
  await new Promise((r) => setTimeout(r, 800)); // simulate delay
  return JSON.parse(JSON.stringify(seed));
}
