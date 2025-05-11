"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { CircularSpinner } from "./CirculaSpinner";


/**
 * @typedef {'javascript' | 'typescript' | 'python' | 'java' | 'c'} ProgrammingLanguage
 */

/**
 * @typedef {Object} TextEditorProps
 * @property {ProgrammingLanguage} language - Specifies the programming language for the editor
 */

/**
 * Text editor component using Monaco Editor
 * @param {TextEditorProps} props
 * @returns {JSX.Element}
 */
const TextEditor = ({ language }) => {
    return (
        <Editor
            height="90vh"
            defaultLanguage={language}
            defaultValue="// start typing..."
            loading={<CircularSpinner useAlternativeColor />}
            theme={useTheme().resolvedTheme === "dark" ? "vs-dark" : "vs"}
            options={{
                autoClosingBrackets: "never",
                autoClosingQuotes: "never",
                formatOnType: true,
                formatOnPaste: true,
                trimAutoWhitespace: true,
            }}
        />
    );
};

export default TextEditor;