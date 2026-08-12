"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Ctx = {
  selectedId: string | null;
  open: (id: string) => void;
  close: () => void;
};

const IndicatorInfoCtx = createContext<Ctx | null>(null);

export function IndicatorInfoProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <IndicatorInfoCtx.Provider
      value={{
        selectedId,
        open: (id) => setSelectedId(id),
        close: () => setSelectedId(null),
      }}
    >
      {children}
    </IndicatorInfoCtx.Provider>
  );
}

export function useIndicatorInfo() {
  const ctx = useContext(IndicatorInfoCtx);
  if (!ctx) {
    return {
      selectedId: null,
      open: () => {},
      close: () => {},
    } as Ctx;
  }
  return ctx;
}
