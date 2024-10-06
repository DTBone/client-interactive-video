import Editor from "@monaco-editor/react";
import { light } from '@mui/material/styles/createPalette';
import { useCode } from "../CodeContext";
import { useEffect } from "react";

const CodeArea = () => {
    const { userLang, setUserCode } = useCode();

    const { userInput, setUserInput, userOutput, setUserOutput } = useCode();

    useEffect(() => {
        localStorage.setItem('userInput', userInput);
        localStorage.setItem('userOutput', userOutput);
    }, [userInput, userOutput]);


    const editorOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 16,
        lineNumbers: 'on',
        automaticLayout: true,


    };
    return (
        <div className="h-full w-full">
            <Editor
                options={editorOptions}
                height="100%"
                width="100%"
                theme={"vs-light"}
                language={userLang}
                defaultLanguage="python"
                defaultValue="# Enter your code here"
                onChange={(value) => { setUserCode(value) }}
            />
        </div>
    )
}

export default CodeArea
