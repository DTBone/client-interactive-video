import Editor from "@monaco-editor/react";
import { light } from '@mui/material/styles/createPalette';
import { useCode } from "../CodeContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Code } from 'lucide-react';

const CodeArea = () => {
    const { userLang, setUserCode } = useCode();

    const { userInput, setUserInput, userOutput, setUserOutput } = useCode();

    const { problem, compile, loading, error } = useSelector(state => state.compile);
    console.log('code format: ', problem?.codeLang, problem?.codeDefault)
    const [language, setLanguage] = useState(problem?.codeLang || 'python');
    const [code, setCode] = useState(problem?.codeDefault || '# Enter your code here');
    useEffect(() => {
        setLanguage(problem?.codeLang || 'python');
        setCode(problem?.codeDefault || '# Enter your code here');
    }, [problem])
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
                language={language}
                defaultLanguage="python"
                defaultValue={code}
                onChange={(value) => { setUserCode(value) }}
            />
        </div>
    )
}

export default CodeArea
