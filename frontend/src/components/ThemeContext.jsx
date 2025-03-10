import React, { createContext, useContext, useState } from "react";

// สร้าง Context
const ThemeContext = createContext();

// ค่าตั้งต้นของ Theme
const defaultTheme = {
  primary: "#ff4d6d",
  secondary: "#ff9e00",
  background: "#0f172a",
  text: "#ffffff",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook เพื่อใช้ Theme ใน Component อื่น ๆ
export const useTheme = () => {
  return useContext(ThemeContext);
}