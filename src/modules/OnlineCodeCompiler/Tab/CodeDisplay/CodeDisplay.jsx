import React from 'react'
import { Typography, Divider, Paper } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';


SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('cpp', cpp);

const CodeDisplay = ({ submissionData }) => {
    const getLanguage = (lang) => {
        const langMap = {
            'javascript': 'javascript',
            'python': 'python',
            'java': 'java',
            'c++': 'cpp',
            // Add more mappings as needed
        };
        return langMap[lang.toLowerCase()] || 'text'; // Default to 'text' if language is not found
    };
    return (
        <div className='h-full'>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, marginBottom: 2, height: "78%" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', }}>
                    <Typography variant="h6">Code</Typography>
                    <Divider orientation="vertical" variant="middle" flexItem sx={{ height: '24px' }} />
                    <Typography sx={{ textTransform: "capitalize" }}>{submissionData.language}</Typography>
                </div>
                <Divider orientation="" variant="middle" flexItem />
                <SyntaxHighlighter
                    language={getLanguage(submissionData.language)}
                    style={docco}
                    customStyle={{
                        padding: '16px',
                        borderRadius: '4px',
                        maxHeight: '93%',
                        overflow: 'auto'
                    }}
                >
                    {submissionData.src}
                </SyntaxHighlighter>
            </Paper>
        </div>
    )
}

export default CodeDisplay
