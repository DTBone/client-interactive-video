// // import MonacoEditor from "@monaco-editor/react";
// // import { useCode } from "../CodeContext";
// // import { useEffect, useState } from "react";
// // import { useSelector } from "react-redux";

// // import * as monaco from 'monaco-editor';
// // import MonacoEditorCopilot from 'monaco-editor-copilot';
// // import { registerCompletion } from "monacopilot";
// // import axiosInstance from "~/Config/axiosInstance";
// // import { debounce } from 'lodash';
// // import { useRef } from "react";


// // const CodeArea = () => {
// //     const { userLang, setUserCode } = useCode();

// //     const { userInput, setUserInput, userOutput, setUserOutput } = useCode();

// //     const { problem, compile, loading, error } = useSelector(state => state.compile);
// //     //console.log('code format: ', problem?.codeFormat)

// //     const editorRef = useRef(null);
// //     const monacoRef = useRef(null);

// //     const [language, setLanguage] = useState(problem?.codeLang || 'python');

// //     useEffect(() => {
// //         setLanguage(userLang || 'python');
// //     }, [userLang]);

// //     useEffect(() => {
// //         if (editorRef.current && monacoRef.current) {
// //             console.log('Editor and Monaco instance are available');
// //             const fetchCompletions = debounce(async (model, position) => {
// //                 console.log('Fetching completions...'); // Add this line
// //                 const textUntilPosition = model.getValueInRange({
// //                     startLineNumber: 1,
// //                     startColumn: 1,
// //                     endLineNumber: position.lineNumber,
// //                     endColumn: position.column
// //                 });

// //                 try {
// //                     const response = await axiosInstance.post('/problem/code-completion', {
// //                         code: textUntilPosition,
// //                         language
// //                     });

// //                     if (!response.data || !response.data.data) {
// //                         return [];
// //                     }

// //                     console.log('Completions fetched:', response.data.data); // Add this line
// //                     return response.data.data.map(item => ({
// //                         label: item.text,
// //                         kind: monacoInstance.languages.CompletionItemKind.Snippet,
// //                         insertText: item.text,
// //                         detail: 'AI Suggestion',
// //                         documentation: { value: 'Generated by Grok AI' }
// //                     }));

// //                 } catch (error) {
// //                     console.error('Error fetching completions:', error);
// //                     return [];
// //                 }
// //             }, 500);

// //             const disposable = monacoRef.current.languages.registerCompletionItemProvider(language, {
// //                 triggerCharacters: ['.', ' ', '\n', '(', '{', '[', ';'],
// //                 provideCompletionItems: async (model, position) => {
// //                     const suggestions = await fetchCompletions(model, position);
// //                     return { suggestions };
// //                 }
// //             });

// //             return () => {
// //                 disposable.dispose();
// //                 fetchCompletions.cancel();
// //             };
// //         }
// //     }, [language])
// //     const handleEditorDidMount = (editor, monacoInstance) => {

// //         editorRef.current = editor;
// //         monacoRef.current = monacoInstance;

// //         editor.onKeyUp(() => {
// //             console.log("Key pressed");
// //         });

// //         console.log('Editor mounted, setting up completion provider');

// //         const fetchCompletions = debounce(async (model, position) => {
// //             console.log('Fetching completions...'); // Add this line
// //             const textUntilPosition = model.getValueInRange({
// //                 startLineNumber: 1,
// //                 startColumn: 1,
// //                 endLineNumber: position.lineNumber,
// //                 endColumn: position.column
// //             });

// //             try {
// //                 const response = await axiosInstance.post('/problem/code-completion', {
// //                     code: textUntilPosition,
// //                     language
// //                 });

// //                 if (!response.data || !response.data.data) {
// //                     return [];
// //                 }

// //                 console.log('Completions fetched:', response.data.data); // Add this line
// //                 return response.data.data.map(item => ({
// //                     label: item.text,
// //                     kind: monacoInstance.languages.CompletionItemKind.Snippet,
// //                     insertText: item.text,
// //                     detail: 'AI Suggestion',
// //                     documentation: { value: 'Generated by Grok AI' }
// //                 }));

// //             } catch (error) {
// //                 console.error('Error fetching completions:', error);
// //                 return [];
// //             }
// //         }, 500);

// //         const disposable = monacoInstance.languages.registerCompletionItemProvider(language, {
// //             triggerCharacters: ['.', ' ', '\n', '(', '{', '[', ';'],
// //             provideCompletionItems: async (model, position) => {
// //                 const suggestions = await fetchCompletions(model, position);
// //                 return { suggestions };
// //             }
// //         });

// //         editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Space, () => {
// //             editor.trigger('', 'editor.action.triggerSuggest', {});
// //         });

// //         return () => {
// //             disposable.dispose();
// //             fetchCompletions.cancel();
// //         };
// //     };


// //     const [code, setCode] = useState(null);
// //     useEffect(() => {
// //         if (problem?.codeFormat && problem.codeFormat.length > 0) {
// //             const matchedFormat = problem.codeFormat.find(format => format.language === userLang);

// //             if (matchedFormat) {
// //                 //console.log("matchedFormat: ", matchedFormat);
// //                 setCode(matchedFormat.codeDefault);
// //             } else {
// //                 setCode("// Enter Your Code Here...");
// //             }
// //         } else {
// //             setCode("// Enter Your Code Here...");
// //         }

// //     }, [problem, userLang]);

// //     // useEffect(() => {
// //     //     setLanguage(problem?.codeLang || 'python');
// //     //     setCode(problem?.codeDefault || '# Enter your code here');
// //     // }, [problem])

// //     useEffect(() => {
// //         localStorage.setItem('userInput', userInput);
// //         localStorage.setItem('userOutput', userOutput);
// //     }, [userInput, userOutput]);


// //     const editorOptions = {
// //         minimap: { enabled: false },
// //         scrollBeyondLastLine: false,
// //         fontSize: 16,
// //         lineNumbers: 'on',
// //         automaticLayout: true,


// //     };
// //     return (
// //         <div className="h-full w-full">
// //             <MonacoEditor
// //                 options={editorOptions}
// //                 height="100%"
// //                 width="100%"
// //                 theme={"vs-light"}
// //                 language={language}
// //                 defaultLanguage="python"
// //                 value={code}
// //                 defaultValue="#Enter your code here..."
// //                 onChange={(value) => { setUserCode(value) }}
// //                 onMount={handleEditorDidMount}

// //             />
// //         </div>
// //     )
// // }

// // export default CodeArea


// import MonacoEditor from "@monaco-editor/react";
// import { useCode } from "../CodeContext";
// import { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { debounce } from 'lodash';
// import axiosInstance from "~/Config/axiosInstance";

// const CodeArea = () => {
//     const { userLang, setUserCode, userInput, setUserInput, userOutput, setUserOutput } = useCode();
//     const { problem, compile, loading, error } = useSelector(state => state.compile);

//     const editorRef = useRef(null);
//     const monacoRef = useRef(null);
//     const [language, setLanguage] = useState('python');
//     const [code, setCode] = useState("// Enter Your Code Here...");

//     // Update language when userLang changes
//     useEffect(() => {
//         setLanguage(userLang || 'python');
//     }, [userLang]);

//     // Update code when problem or language changes
//     useEffect(() => {
//         if (problem?.codeFormat && problem.codeFormat.length > 0) {
//             const matchedFormat = problem.codeFormat.find(format => format.language === userLang);
//             setCode(matchedFormat ? matchedFormat.codeDefault : "// Enter Your Code Here...");
//         } else {
//             setCode("// Enter Your Code Here...");
//         }
//     }, [problem, userLang]);

//     // Save user input/output to localStorage
//     useEffect(() => {
//         localStorage.setItem('userInput', userInput);
//         localStorage.setItem('userOutput', userOutput);
//     }, [userInput, userOutput]);

//     // Create a shared fetchCompletions function to avoid code duplication
//     const createFetchCompletions = (monacoInstance) => {
//         return debounce(async (model, position) => {
//             console.log('Fetching completions...');
//             const entireCode = model.getValue();

//             const textUntilPosition = model.getValueInRange({
//                 startLineNumber: 1,
//                 startColumn: 1,
//                 endLineNumber: position.lineNumber,
//                 endColumn: position.column
//             });

//             const textAfterPosition = model.getValueInRange({
//                 startLineNumber: position.lineNumber,
//                 startColumn: position.column,
//                 endLineNumber: model.getLineCount(),
//                 endColumn: model.getLineMaxColumn(model.getLineCount())
//             });

//             const currentLine = model.getLineContent(position.lineNumber);

//             const contextLineCount = 5;
//             const startLineForContext = Math.max(1, position.lineNumber - contextLineCount);
//             const lineContext = [];

//             for (let i = startLineForContext; i <= position.lineNumber; i++) {
//                 lineContext.push(model.getLineContent(i));
//             }


//             try {
//                 const response = await axiosInstance.post('/problem/code-completion', {
//                     fullCode: entireCode,
//                     codeBeforeCursor: textUntilPosition,
//                     codeAfterCursor: textAfterPosition,
//                     currentLine: currentLine,
//                     lineContext: lineContext.join('\n'),
//                     cursorPosition: {
//                         lineNumber: position.lineNumber,
//                         column: position.column
//                     },
//                     language
//                 });

//                 if (!response.data || !response.data.data) {
//                     return [];
//                 }

//                 console.log('Completions fetched:', response.data.data);
//                 return response.data.data.map(item => ({
//                     label: item.text,
//                     kind: monacoInstance.languages.CompletionItemKind.Snippet,
//                     insertText: item.text,
//                     detail: 'AI Suggestion',
//                     documentation: { value: 'Generated by Grok AI' }
//                 }));
//             } catch (error) {
//                 console.error('Error fetching completions:', error);
//                 return [];
//             }
//         }, 500);
//     };

//     // Set up completion provider when editor is mounted
//     useEffect(() => {
//         if (!editorRef.current || !monacoRef.current) return;

//         console.log('Editor and Monaco instance are available');
//         const monacoInstance = monacoRef.current;
//         const fetchCompletions = createFetchCompletions(monacoInstance);

//         const disposable = monacoInstance.languages.registerCompletionItemProvider(language, {
//             triggerCharacters: ['.', ' ', '\n', '(', '{', '[', ';'],
//             provideCompletionItems: async (model, position) => {
//                 const suggestions = await fetchCompletions(model, position);
//                 return { suggestions };
//             }
//         });

//         return () => {
//             disposable.dispose();
//             fetchCompletions.cancel();
//         };
//     }, [language, editorRef.current, monacoRef.current]);

//     const handleEditorDidMount = (editor, monacoInstance) => {
//         // Lưu tham chiếu đến editor và monacoInstance
//         editorRef.current = editor;
//         monacoRef.current = monacoInstance;

//         console.log('Editor mounted');

//         // Chỉ thiết lập sự kiện keyUp và phím tắt, không đăng ký completion provider ở đây
//         editor.onKeyUp(() => {
//             console.log("Key pressed");
//         });

//         // Thêm phím tắt để kích hoạt gợi ý
//         editor.addCommand(
//             monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Space,
//             () => {
//                 editor.trigger('', 'editor.action.triggerSuggest', {});
//             }
//         );

//     };
//     const editorOptions = {
//         minimap: { enabled: false },
//         scrollBeyondLastLine: false,
//         fontSize: 16,
//         lineNumbers: 'on',
//         automaticLayout: true,
//     };

//     const setupInLineCompletions = (editor, monacoInstance) => {
//         let ghostTextWidget = null;
//         let currentSuggestions = [];

//         // Đăng ký completion provider như bình thường
//         const disposable = monacoInstance.languages.registerCompletionItemProvider(language, {
//             triggerCharacters: ['.', ' ', '\n', '(', '{', '[', ';'],
//             provideCompletionItems: async (model, position) => {
//                 console.log('Completion triggered at position:', position);

//                 // Lấy gợi ý từ API
//                 const apiSuggestions = await fetchCompletions(model, position);
//                 currentSuggestions = apiSuggestions;

//                 // Nếu chỉ có 1 gợi ý, hiển thị nó ngay dưới dạng ghost text
//                 if (apiSuggestions && apiSuggestions.length === 1) {
//                     showGhostText(editor, position, apiSuggestions[0].insertText);
//                 } else if (ghostTextWidget) {
//                     // Nếu có nhiều hơn 1 gợi ý, xóa ghost text (nếu có)
//                     ghostTextWidget.dispose();
//                     ghostTextWidget = null;
//                 }

//                 // Chuyển đổi thành định dạng CompletionItem
//                 const suggestions = apiSuggestions.map(item => ({
//                     label: item.text,
//                     kind: monacoInstance.languages.CompletionItemKind.Snippet,
//                     insertText: item.text,
//                     detail: 'AI Suggestion',
//                     documentation: { value: 'Generated by Grok AI' }
//                 }));

//                 return { suggestions };
//             }
//         })

//         editor.onDidLayoutChange(() => {
//             const widgets = editor.getOverlayWidgets();
//             const suggestWidget = widgets.find(w => w.getId().includes('suggest'));

//             if (suggestWidget) {
//                 const domNode = suggestWidget.getDomNode();
//                 if (domNode) {
//                     // Tìm tất cả các mục gợi ý trong widget
//                     const suggestionItems = domNode.querySelectorAll('.monaco-list-row');

//                     suggestionItems.forEach((item, index) => {
//                         item.addEventListener('mouseover', () => {
//                             // Lấy vị trí hiện tại của con trỏ
//                             const position = editor.getPosition();

//                             // Xóa ghost text hiện tại nếu có
//                             if (ghostTextWidget) {
//                                 ghostTextWidget.dispose();
//                                 ghostTextWidget = null;
//                             }

//                             // Hiển thị ghost text cho gợi ý đang hover
//                             if (currentSuggestions[index]) {
//                                 showGhostText(editor, position, currentSuggestions[index].text);
//                             }
//                         });
//                     });
//                 }
//             }
//         });
//         function showGhostText(editor, position, text) {
//             // Xóa ghost text hiện tại nếu có
//             if (ghostTextWidget) {
//                 ghostTextWidget.dispose();
//             }

//             // Tạo ghost text mới
//             ghostTextWidget = editor.createGhostText({
//                 text: text,
//                 position: position,
//                 opacity: 0.5, // Độ mờ của ghost text
//                 className: 'ai-suggestion-ghost-text'
//             });
//         }

//         return {
//             dispose: () => {
//                 disposable.dispose();
//                 if (ghostTextWidget) {
//                     ghostTextWidget.dispose();
//                 }
//             }
//         };
//     };

//     // Tạo một class GhostTextWidget để hiển thị chữ mờ
//     class GhostTextWidget {
//         constructor(editor, position, text) {
//             this.editor = editor;
//             this.position = position;
//             this.text = text;
//             this.domNode = document.createElement('div');
//             this.domNode.className = 'ghost-text-widget';
//             this.domNode.style.color = 'rgba(128, 128, 128, 0.7)';
//             this.domNode.textContent = text;
//             this.contentWidget = {
//                 getId: () => 'ghost-text',
//                 getDomNode: () => this.domNode,
//                 getPosition: () => {
//                     return {
//                         position: this.position,
//                         preference: [
//                             monaco.editor.ContentWidgetPositionPreference.ABOVE,
//                             monaco.editor.ContentWidgetPositionPreference.BELOW
//                         ]
//                     };
//                 }
//             };
//             this.editor.addContentWidget(this.contentWidget);
//         }

//         dispose() {
//             this.editor.removeContentWidget(this.contentWidget);
//         }

//         update(position, text) {
//             this.position = position;
//             this.text = text;
//             this.domNode.textContent = text;
//             this.editor.layoutContentWidget(this.contentWidget);
//         }
//     }

//     // Sử dụng trong completion provider
//     const disposable = monacoInstance.languages.registerCompletionItemProvider(language, {
//         triggerCharacters: ['.', ' ', '\n', '(', '{', '[', ';'],
//         provideCompletionItems: async (model, position) => {
//             const apiSuggestions = await fetchCompletions(model, position);

//             // Nếu chỉ có 1 gợi ý, hiển thị ngay
//             if (apiSuggestions && apiSuggestions.length === 1) {
//                 if (ghostTextWidget) {
//                     ghostTextWidget.dispose();
//                 }
//                 ghostTextWidget = new GhostTextWidget(editorRef.current, position, apiSuggestions[0].text);
//             }

//             // Trả về gợi ý để hiển thị trong dropdown
//             return {
//                 suggestions: apiSuggestions.map(item => ({
//                     label: item.text,
//                     kind: monacoInstance.languages.CompletionItemKind.Snippet,
//                     insertText: item.text,
//                     detail: 'AI Suggestion',
//                     documentation: { value: 'Generated by Grok AI' },
//                     // Lưu data gốc để sử dụng khi hover
//                     originalData: item
//                 }))
//             };
//         }
//     });

//     // Lắng nghe sự kiện hover trên gợi ý
//     editor.onDidContentSuggest && editor.onDidContentSuggest(e => {
//         if (e.suggestWidgetVisible && e.focusedItem) {
//             const focusedData = e.focusedItem.completion.originalData;
//             if (focusedData) {
//                 if (ghostTextWidget) {
//                     ghostTextWidget.update(editor.getPosition(), focusedData.text);
//                 } else {
//                     ghostTextWidget = new GhostTextWidget(editor, editor.getPosition(), focusedData.text);
//                 }
//             }
//         }
//     });
//     return (
//         <div className="h-full w-full">
//             <MonacoEditor
//                 options={editorOptions}
//                 height="100%"
//                 width="100%"
//                 theme="vs-light"
//                 language={language}
//                 defaultLanguage="python"
//                 value={code}
//                 defaultValue="#Enter your code here..."
//                 onChange={(value) => setUserCode(value)}
//                 onMount={handleEditorDidMount}
//             />
//         </div>
//     );
// };

// export default CodeArea;




import MonacoEditor from "@monaco-editor/react";
import { useCode } from "../CodeContext";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { debounce } from 'lodash';
import axiosInstance from "~/Config/axiosInstance";

const CodeArea = () => {
    const { userLang, setUserCode, userInput, setUserInput, userOutput, setUserOutput } = useCode();
    const { problem, compile, loading, error } = useSelector(state => state.compile);

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const ghostTextDecorationsRef = useRef([]);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState("// Enter Your Code Here...");

    // Update language when userLang changes
    useEffect(() => {
        setLanguage(userLang || 'python');
    }, [userLang]);

    // Update code when problem or language changes
    useEffect(() => {
        if (problem?.codeFormat && problem.codeFormat.length > 0) {
            const matchedFormat = problem.codeFormat.find(format => format.language === userLang);
            setCode(matchedFormat ? matchedFormat.codeDefault : "// Enter Your Code Here...");
        } else {
            setCode("// Enter Your Code Here...");
        }
    }, [problem, userLang]);

    // Save user input/output to localStorage
    useEffect(() => {
        localStorage.setItem('userInput', userInput);
        localStorage.setItem('userOutput', userOutput);
    }, [userInput, userOutput]);

    // Create a fetchCompletions function that also handles ghost text
    const createFetchCompletions = (monacoInstance, editor) => {
        return debounce(async (model, position) => {
            console.log('Fetching completions...');
            const entireCode = model.getValue();

            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });

            const textAfterPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: model.getLineCount(),
                endColumn: model.getLineMaxColumn(model.getLineCount())
            });

            const currentLine = model.getLineContent(position.lineNumber);

            const contextLineCount = 5;
            const startLineForContext = Math.max(1, position.lineNumber - contextLineCount);
            const lineContext = [];

            for (let i = startLineForContext; i <= position.lineNumber; i++) {
                lineContext.push(model.getLineContent(i));
            }

            try {
                const response = await axiosInstance.post('/problem/code-completion', {
                    fullCode: entireCode,
                    codeBeforeCursor: textUntilPosition,
                    codeAfterCursor: textAfterPosition,
                    currentLine: currentLine,
                    lineContext: lineContext.join('\n'),
                    cursorPosition: {
                        lineNumber: position.lineNumber,
                        column: position.column
                    },
                    language
                });

                if (!response.data || !response.data.data || response.data.data.length === 0) {
                    return [];
                }

                console.log('Completions fetched:', response.data.data);

                // Show ghost text for the first suggestion
                if (response.data.data.length > 0) {
                    showGhostText(editor, model, position, response.data.data[0].text);
                }

                return response.data.data.map(item => ({
                    label: item.text,
                    kind: monacoInstance.languages.CompletionItemKind.Snippet,
                    insertText: item.text,
                    detail: 'AI Suggestion',
                    documentation: { value: 'Generated by Grok AI' }
                }));
            } catch (error) {
                console.error('Error fetching completions:', error);
                return [];
            }
        }, 500);
    };

    // Function to show ghost text
    const showGhostText = (editor, model, position, text) => {
        if (!editor || !text) return;

        // Clear previous ghost text decorations
        if (ghostTextDecorationsRef.current.length) {
            editor.deltaDecorations(ghostTextDecorationsRef.current, []);
            ghostTextDecorationsRef.current = [];
        }

        // Create ghost text decoration
        const ghostTextDecoration = {
            range: new monacoRef.current.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
            ),
            options: {
                after: {
                    content: text,
                    inlineClassName: 'ghost-text-suggestion'
                }
            }
        };

        // Apply the decoration
        ghostTextDecorationsRef.current = editor.deltaDecorations([], [ghostTextDecoration]);

        // Add CSS styles for ghost text
        const style = document.createElement('style');
        style.innerHTML = `
            .ghost-text-suggestion {
                opacity: 0.6;
                color: #888888;
                font-style: italic;
            }
        `;
        document.head.appendChild(style);
    };

    // Function to accept ghost text suggestion
    const acceptGhostTextSuggestion = () => {
        if (!editorRef.current || ghostTextDecorationsRef.current.length === 0) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        const decorations = model.getDecorationOptions(ghostTextDecorationsRef.current[0]);
        if (!decorations || !decorations.after) return;

        const position = editorRef.current.getPosition();
        const text = decorations.after.content;

        // Insert the ghost text at current position
        model.pushEditOperations([], [{
            range: new monacoRef.current.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
            ),
            text: text
        }], () => null);

        // Clear ghost text decoration
        editorRef.current.deltaDecorations(ghostTextDecorationsRef.current, []);
        ghostTextDecorationsRef.current = [];
    };

    // Set up completion provider when editor is mounted
    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;

        console.log('Editor and Monaco instance are available');
        const monacoInstance = monacoRef.current;
        const editor = editorRef.current;
        const fetchCompletions = createFetchCompletions(monacoInstance, editor);

        const disposable = monacoInstance.languages.registerCompletionItemProvider(language, {
            triggerCharacters: ['.', ' ', '\n', '(', '{', '[', ';'],
            provideCompletionItems: async (model, position) => {
                const suggestions = await fetchCompletions(model, position);
                return { suggestions };
            }
        });

        // Listen for Tab key to accept ghost text suggestion
        editor.onKeyDown((e) => {
            if (e.keyCode === monacoInstance.KeyCode.Tab && ghostTextDecorationsRef.current.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                acceptGhostTextSuggestion();
            }
        });

        return () => {
            disposable.dispose();
            fetchCompletions.cancel();
            // Clear ghost text decorations
            if (ghostTextDecorationsRef.current.length) {
                editor.deltaDecorations(ghostTextDecorationsRef.current, []);
                ghostTextDecorationsRef.current = [];
            }
        };
    }, [language, editorRef.current, monacoRef.current]);

    const handleEditorDidMount = (editor, monacoInstance) => {
        // Save references to editor and monacoInstance
        editorRef.current = editor;
        monacoRef.current = monacoInstance;

        console.log('Editor mounted');

        // Set up key events
        editor.onKeyUp((e) => {
            console.log("Key pressed");

            // If Escape key is pressed, clear ghost text
            if (e.keyCode === monacoInstance.KeyCode.Escape && ghostTextDecorationsRef.current.length > 0) {
                editor.deltaDecorations(ghostTextDecorationsRef.current, []);
                ghostTextDecorationsRef.current = [];
            }
        });

        // Add shortcut to trigger suggestions
        editor.addCommand(
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Space,
            () => {
                editor.trigger('', 'editor.action.triggerSuggest', {});
            }
        );

        // Add CSS for ghost text
        const style = document.createElement('style');
        style.innerHTML = `
            .ghost-text-suggestion {
                opacity: 0.6;
                color: #888888;
                font-style: italic;
            }
        `;
        document.head.appendChild(style);
    };

    const editorOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 16,
        lineNumbers: 'on',
        automaticLayout: true,
        tabCompletion: 'on',
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        acceptSuggestionOnEnter: 'on'
    };

    return (
        <div className="h-full w-full">
            <MonacoEditor
                options={editorOptions}
                height="100%"
                width="100%"
                theme="vs-light"
                language={language}
                defaultLanguage="python"
                value={code}
                defaultValue="#Enter your code here..."
                onChange={(value) => setUserCode(value)}
                onMount={handleEditorDidMount}
            />
        </div>
    );
};

export default CodeArea;