import React, { createContext, useContext, useState, useEffect } from "react";
const GenderThemeContext = createContext({
    gender: "women",
    setGender: () => { },
    hasSelected: false,
});
export const useGenderTheme = () => useContext(GenderThemeContext);
export const GenderThemeProvider = ({ children }) => {
    const [gender, setGenderState] = useState(() => {
        const saved = localStorage.getItem("muskan-gender");
        return saved || "women";
    });
    const [hasSelected, setHasSelected] = useState(() => !!localStorage.getItem("muskan-gender"));
    const setGender = (g) => {
        setGenderState(g);
        setHasSelected(true);
        localStorage.setItem("muskan-gender", g);
    };
    useEffect(() => {
        document.documentElement.classList.remove("theme-women", "theme-men");
        document.documentElement.classList.add(`theme-${gender}`);
    }, [gender]);
    return (<GenderThemeContext.Provider value={{ gender, setGender, hasSelected }}>
      {children}
    </GenderThemeContext.Provider>);
};
