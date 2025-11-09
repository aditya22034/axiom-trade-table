export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function compactNumber(n: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(n);
}

export function formatPrice(n: number) {
  return n < 1 ? n.toFixed(4) : n.toFixed(2);
}
