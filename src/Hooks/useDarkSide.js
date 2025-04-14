// import { useState, useEffect } from "react";

// export default function useDarkSide() {
//     const [theme, setTheme] = useState(localStorage.theme);
//     const colorTheme = theme === "dark" ? "dark" : "light";
//     localStorage.setItem("theme", theme);
//     useEffect(() => {
//         const root = window.document.documentElement;
//         root.classList.remove(colorTheme);
//         root.classList.add(theme);
//         if (localStorage.theme == "dark")
//             localStorage.removeItem("theme");
//         else localStorage.setItem("theme", theme);
//     }, [theme, colorTheme]);

//     return [colorTheme, setTheme];
// }


// import { useState, useEffect } from "react";

// export default function useDarkSide() {
//     const [theme, setTheme] = useState(() => {
//         return localStorage.getItem("theme") || "light";
//     });

//     const colorTheme = theme === "dark" ? "light" : "dark";

//     useEffect(() => {
//         const root = window.document.documentElement;
//         root.classList.remove(colorTheme);
//         root.classList.add(theme);
//         localStorage.setItem("theme", theme);
//     }, [theme, colorTheme]);

//     return [colorTheme, setTheme];
// }