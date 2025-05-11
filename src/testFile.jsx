import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import MonacoEditorCopilot from 'monaco-editor-copilot'; // Giả sử đây là tên thư viện

const Editor = ({ code, setUserCode, language, editorOptions }) => {
    const containerRef = useRef(null);
    const editorRef = useRef(null);
    const copilotRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && !editorRef.current) {
            // Khởi tạo Monaco Editor
            editorRef.current = monaco.editor.create(containerRef.current, {
                value: code || '// Start typing your code here...',
                language: language || 'javascript',
                ...editorOptions
            });

            // Cấu hình Copilot
            const config = {
                openaiKey: "", // Sử dụng biến môi trường
                // Các cấu hình khác nếu cần
            };

            // Khởi tạo Copilot
            copilotRef.current = MonacoEditorCopilot(editorRef.current, config);

            // Xử lý sự kiện thay đổi nội dung
            editorRef.current.onDidChangeModelContent(() => {
                const value = editorRef.current.getValue();
                setUserCode(value);
            });
        }

        // Cleanup khi component unmount
        return () => {
            if (copilotRef.current) {
                copilotRef.current.dispose(); // Giả sử phương thức dispose() tồn tại
            }
            if (editorRef.current) {
                editorRef.current.dispose();
                editorRef.current = null;
            }
        };
    }, []); // Dependency trống để chỉ chạy một lần khi component mount

    // Cập nhật ngôn ngữ khi prop thay đổi
    useEffect(() => {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            monaco.editor.setModelLanguage(model, language);
        }
    }, [language]);

    // Cập nhật giá trị khi prop code thay đổi từ bên ngoài
    useEffect(() => {
        if (editorRef.current && code !== editorRef.current.getValue()) {
            editorRef.current.setValue(code);
        }
    }, [code]);

    return (
        <div id="container" ref={containerRef} className="h-full w-full"></div>
    );
};

export default Editor;