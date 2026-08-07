'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type IntroContextValue = {
  /** True once the splash lockup has landed and the header may show its own. */
  brandRevealed: boolean;
  revealBrand: () => void;
};

// Defaults are "revealed" so anything rendered outside the provider still shows.
const IntroContext = createContext<IntroContextValue>({
  brandRevealed: true,
  revealBrand: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export default function IntroProvider({ children }: { children: ReactNode }) {
  const [brandRevealed, setBrandRevealed] = useState(false);
  const revealBrand = useCallback(() => setBrandRevealed(true), []);

  const value = useMemo(
    () => ({ brandRevealed, revealBrand }),
    [brandRevealed, revealBrand]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
