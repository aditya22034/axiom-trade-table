"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens, priceBus, type Token } from "@/lib/mock-data";
import { useAppDispatch, useAppSelector } from "./useStore";
import {
  setSort,
  setTab,
  openDetails,
  closeDetails,
} from "@/lib/ui-slice";
import { cn, compactNumber, formatPrice } from "@/lib/utils";

import * as Tooltip from "@radix-ui/react-tooltip";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";

const tabs = [
  { key: "new", label: "New pairs" },
  { key: "final", label: "Final Stretch" },
  { key: "migrated", label: "Migrated" },
] as const;

export default function TokenDiscovery() {
  const dispatch = useAppDispatch();
  const { tab, sortKey, sortDir, selectedSymbol } = useAppSelector(
    (s) => s.ui
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
  });

  const [live, setLive] = useState<Record<string, Token>>({});

  // ✅ WebSocket-like price updates
  useEffect(() => {
    if (!data) return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Token>).detail;
      setLive((prev) => ({ ...prev, [detail.symbol]: detail }));
    };

    priceBus.addEventListener("tick", handler);
    priceBus.start(data);

    return () => priceBus.removeEventListener("tick", handler);
  }, [data]);

  // ✅ Filter + Sort tokens
  const filtered = useMemo(() => {
    if (!data) return [];

    const tag =
      tab === "new"
        ? "New"
        : tab === "final"
        ? "Final Stretch"
        : "Migrated";

    const list = data
      .filter((t) => t.tag === tag)
      .map((t) => live[t.symbol] ?? t);

    return list.sort((a, b) => {
      const direction = sortDir === "asc" ? 1 : -1;
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];

      if (typeof av === "string") return av.localeCompare(bv) * direction;
      return (av - bv) * direction;
    });
  }, [data, live, tab, sortKey, sortDir]);

  if (isLoading)
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="text-red-400 border border-border rounded p-4">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <div className="space-y-4">
      {/* ✅ Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => dispatch(setTab(t.key))}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition",
              tab === t.key
                ? "bg-accent text-white"
                : "bg-card border border-border text-textMuted hover:bg-hover"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ✅ Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs uppercase text-textMuted tracking-wide">
          <Header label="Token" onClick={() => dispatch(setSort({ key: "name" }))} />
          <Header label="Price" onClick={() => dispatch(setSort({ key: "price" }))} />
          <Header label="24h" onClick={() => dispatch(setSort({ key: "change" }))} />
          <Header label="Volume" onClick={() => dispatch(setSort({ key: "volume" }))} />
          <Header label="Mkt Cap" onClick={() => dispatch(setSort({ key: "marketCap" }))} />
          <div className="col-span-2" />
        </div>

        <ul className="divide-y divide-border/50">
          {filtered.map((t) => (
            <Row
              key={t.symbol}
              token={t}
              onOpen={() => dispatch(openDetails(t.symbol))}
            />
          ))}
        </ul>
      </div>

      {/* ✅ Modal */}
      <Dialog.Root
        open={!!selectedSymbol}
        onOpenChange={(open) => !open && dispatch(closeDetails())}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6">
            <Dialog.Title className="text-lg font-bold">
              Token Details
            </Dialog.Title>

            {selectedSymbol && (
              <Details tokens={filtered} symbol={selectedSymbol} />
            )}

            <div className="mt-6 text-right">
              <Dialog.Close className="px-3 py-2 rounded border border-border hover:bg-hover">
                Close
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// ✅ Table Header
function Header({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="col-span-2 text-left hover:text-white transition"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ✅ Table Row
const Row = React.memo(function Row({
  token,
  onOpen,
}: {
  token: Token;
  onOpen: () => void;
}) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    setFlash(token.change >= 0 ? "up" : "down");
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [token.price, token.change]);

  return (
    <li
      className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-hover/60 transition"
    >
      {/* Token Name */}
      <div className="col-span-4 flex items-center gap-3">
        <div className="h-8 w-8 flex items-center justify-center bg-hover rounded-full border border-border text-xs">
          {token.chain}
        </div>
        <div>
          <div className="font-semibold">
            {token.name}{" "}
            <span className="text-textMuted">({token.symbol})</span>
          </div>
          <div className="text-xs text-textMuted">{token.tag}</div>
        </div>
      </div>

      {/* Price */}
      <div
        className={cn(
          "col-span-2 font-semibold",
          flash === "up" && "text-up",
          flash === "down" && "text-down"
        )}
      >
        ${formatPrice(token.price)}
      </div>

      {/* Change */}
      <div
        className={cn(
          "col-span-2",
          token.change >= 0 ? "text-up" : "text-down"
        )}
      >
        {token.change >= 0 ? "+" : ""}
        {token.change.toFixed(2)}%
      </div>

      {/* Volume */}
      <div className="col-span-2">{compactNumber(token.volume)}</div>

      {/* Market Cap */}
      <div className="col-span-2">{compactNumber(token.marketCap)}</div>

      {/* Actions */}
      <div className="col-span-12 md:col-span-2 flex justify-end gap-2">
        {/* Tooltip */}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="px-3 py-2 text-xs rounded border border-border hover:bg-hover">
                Info
              </button>
            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content className="rounded border border-border bg-card px-3 py-2 text-xs">
                Chain: {token.chain}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        {/* Popover */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="px-3 py-2 text-xs rounded border border-border hover:bg-hover">
              Actions
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content className="rounded-xl border border-border bg-card p-2 text-sm">
              <button className="w-full px-3 py-2 rounded hover:bg-hover">
                Watchlist
              </button>
              <button className="w-full px-3 py-2 rounded hover:bg-hover">
                Alert me
              </button>
              <button
                className="w-full px-3 py-2 rounded hover:bg-hover"
                onClick={onOpen}
              >
                Details
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </li>
  );
});

// ✅ Modal Details
function Details({
  symbol,
  tokens,
}: {
  symbol: string;
  tokens: Token[];
}) {
  const t = tokens.find((x) => x.symbol === symbol);
  if (!t) return null;

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-hover border border-border flex items-center justify-center">
          {t.chain}
        </div>

        <div>
          <div className="text-lg font-semibold">
            {t.name} <span className="text-textMuted">({t.symbol})</span>
          </div>
          <div className="text-sm text-textMuted">
            Tag: {t.tag} • Chain: {t.chain}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm mt-4">
        <Info label="Price" value={`$${formatPrice(t.price)}`} />
        <Info
          label="24h Change"
          value={`${t.change >= 0 ? "+" : ""}${t.change.toFixed(2)}%`}
          accent={t.change >= 0 ? "up" : "down"}
        />
        <Info label="Volume" value={compactNumber(t.volume)} />
        <Info label="Market Cap" value={compactNumber(t.marketCap)} />
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "up" | "down";
}) {
  return (
    <div className="rounded border border-border bg-hover p-3">
      <div className="text-xs text-textMuted">{label}</div>
      <div
        className={cn(
          "font-semibold",
          accent === "up" && "text-up",
          accent === "down" && "text-down"
        )}
      >
        {value}
      </div>
    </div>
  );
}
