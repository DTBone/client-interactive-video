import { createContext, useContext, useEffect, useState } from 'react';

const CodeContext = createContext();

export const CodeProvider = ({ children }) => {
    // State variable to set users source code
    const [userCode, setUserCode] = useState(``);

    // State variable to set editors default language
    const [userLang, setUserLang] = useState("python");

    // State variable to set users input
    const [userInput, setUserInput] = useState("");

    // State variable to set users output
    const [userOutput, setUserOutput] = useState("");

    // Loading state variable to show spinner
    // while fetching data
    const [loading, setLoading] = useState(false);

    return (
        <CodeContext.Provider
            value={{
                userCode, setUserCode,
                userLang, setUserLang,
                userInput, setUserInput,
                userOutput, setUserOutput,
                loading, setLoading
            }}
        >
            {children}
        </CodeContext.Provider>
    );
};

export const useCode = () => useContext(CodeContext);