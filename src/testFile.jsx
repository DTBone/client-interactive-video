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
        <div>
            <slide>
                <title>Interactive Coding Learning Platform</title>
                <content>
                    <h1>Interactive Coding Learning Platform</h1>
                    <p>An online learning platform that combines interactive video lessons and a built-in code editor</p>
                </content>
            </slide>

            <slide>
                <title>Problem Statement</title>
                <content>
                    <h2>Challenges in Learning to Code</h2>
                    <ul>
                        <li>Passive video lessons are often not engaging</li>
                        <li>Lack of immediate feedback and practice opportunities</li>
                        <li>Difficulty transitioning from theory to hands-on coding</li>
                    </ul>
                </content>
            </slide>

            <slide>
                <title>Proposed Solution</title>
                <content>
                    <h2>Interactive Coding Learning Platform</h2>
                    <p>Combines interactive video lessons with an integrated code editor for hands-on practice</p>
                    <ul>
                        <li>Interactive video lessons with embedded quizzes and exercises</li>
                        <li>Integrated code editor to write and test code directly in the platform</li>
                        <li>Instant feedback on code execution and performance</li>
                    </ul>
                </content>
            </slide>

            <slide>
                <title>Key Features</title>
                <content>
                    <h2>Key Features</h2>
                    <ul>
                        <li>Interactive video lessons with embedded quizzes and exercises</li>
                        <li>Integrated code editor for hands-on coding practice</li>
                        <li>Instant feedback on code execution and performance</li>
                        <li>Progress tracking and personalized learning paths</li>
                        <li>Support for multiple programming languages</li>
                    </ul>
                </content>
            </slide>

            <slide>
                <title>Benefits</title>
                <content>
                    <h2>Benefits of Interactive Coding Learning</h2>
                    <ul>
                        <li>Increased engagement and active learning</li>
                        <li>Seamless transition from theory to practice</li>
                        <li>Immediate feedback and problem-solving reinforcement</li>
                        <li>Personalized learning experience</li>
                        <li>Improved knowledge retention and coding skills</li>
                    </ul>
                </content>
            </slide>

            <slide>
                <title>Conclusion</title>
                <content>
                    <h2>Conclusion</h2>
                    <p>The Interactive Coding Learning Platform offers a comprehensive solution to the challenges faced by aspiring programmers. By combining interactive video lessons and hands-on coding practice, the platform provides an engaging and effective learning experience that helps learners develop their coding skills efficiently.</p>
                </content>
            </slide>
        </div>
    );
};

export default HTMLEditor;