"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorMode =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";

interface ColorModeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined,
);

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colorMode, setColorModeState] = useState<ColorMode>("black");

  useEffect(() => {
    const savedMode = localStorage.getItem("app-color-mode") as ColorMode;
    if (
      savedMode &&
      ["amber", "blue", "pink", "rose", "emerald", "black"].includes(savedMode)
    ) {
      setColorModeState(savedMode);
      document.documentElement.setAttribute("data-color-mode", savedMode);
    } else {
      document.documentElement.setAttribute("data-color-mode", "black");
    }
  }, []);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem("app-color-mode", mode);
    document.documentElement.setAttribute("data-color-mode", mode);
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
};
