import React, { createContext, useContext, useState, useEffect } from 'react';

interface DragonContextType {
  isDragonActive: boolean;
  toggleDragon: () => void;
  setIsDragonActive: (active: boolean) => void;
}

const DragonContext = createContext<DragonContextType>({
  isDragonActive: false,
  toggleDragon: () => {},
  setIsDragonActive: () => {},
});

export function useDragon() {
  return useContext(DragonContext);
}

export function DragonProvider({ children }: { children: React.ReactNode }) {
  const [isDragonActive, setIsDragonActive] = useState(() => {
    const stored = localStorage.getItem('dragon_cursor_enabled');
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('dragon_cursor_enabled', String(isDragonActive));
  }, [isDragonActive]);

  const toggleDragon = () => setIsDragonActive((prev) => !prev);

  return (
    <DragonContext.Provider value={{ isDragonActive, toggleDragon, setIsDragonActive }}>
      {children}
    </DragonContext.Provider>
  );
}
