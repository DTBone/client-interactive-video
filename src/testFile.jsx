import { Editor } from '@monaco-editor/react'
import { Divider, Typography } from '@mui/material'
import React from 'react'

const HTMLEditor = (selectedLanguage, handleCodeChange, index) => {
    const editorOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 16,
        lineNumbers: 'on',
        automaticLayout: true,
    };


    return (
        <div className='h-[50vh] w-full'>
            <Typography>Code</Typography>
            <Editor
                options={editorOptions}
                height="100%"
                width="100%"
                theme="vs-light"
                language={selectedLanguage}
                defaultValue="# Enter your code here"
                onChange={(newValue) => handleCodeChange(index, newValue, selectedLanguage)}
            />

        </div>
    );
};

export default HTMLEditor;