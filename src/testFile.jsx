import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const HTMLEditor = () => {
    // State để lưu nội dung
    const [content, setContent] = useState('');

    // Ref cho editor
    const editor = useRef(null);

    // Cấu hình Jodit
    const config = {
        readonly: false, // Cho phép chỉnh sửa
        placeholder: 'Nhập nội dung HTML của bạn...',
        // Các nút trong thanh công cụ
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'link', '|',
            'align', 'list', 'indent', 'outdent', '|',
            'hr', 'copyformat', '|',
            'undo', 'redo', '|',
            'fullsize', 'preview', 'print', '|',
            'source' // Nút xem mã HTML
        ],
        // Cấu hình ngôn ngữ
        language: 'vi',

        // Tùy chọn xuất HTML
        defaultMode: 1, // Chế độ WYSIWYG
        beautyHTML: true,

        // Cấu hình upload hình ảnh (nếu cần)
        uploader: {
            url: '/upload', // Điều chỉnh đường dẫn upload
            insertImageAsBase64URI: true
        }
    };

    // Xử lý thay đổi nội dung
    const handleContentChange = (newContent) => {
        setContent(newContent);
    };

    // Sao chép mã HTML
    const copyHTML = () => {
        navigator.clipboard.writeText(content);
        alert('Đã sao chép mã HTML!');
    };

    // Xóa nội dung
    const clearContent = () => {
        if (editor.current) {
            editor.current.value = '';
            setContent('');
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Jodit HTML Editor</h2>

            {/* Editor */}
            <div className="mb-4">
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onBlur={newContent => handleContentChange(newContent)}
                    onChange={newContent => { }}
                />
            </div>

            {/* Các nút chức năng */}
            <div className="flex space-x-4 mt-4">
                <button
                    onClick={copyHTML}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Sao chép HTML
                </button>

                <button
                    onClick={clearContent}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Xóa nội dung
                </button>

                {/* Nút xem trước */}
                <button
                    onClick={() => {
                        // Mở cửa sổ preview
                        const previewWindow = window.open('', 'Preview', 'width=600,height=400');
                        if (previewWindow) {
                            previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>HTML Preview</title>
                    <style>
                      body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    </style>
                  </head>
                  <body>
                    ${content}
                  </body>
                </html>
              `);
                            previewWindow.document.close();
                        }
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Xem trước
                </button>
            </div>

            {/* Hiển thị mã HTML */}
            <div className="mt-4">
                <h3 className="font-bold mb-2">Mã HTML:</h3>
                <textarea
                    value={content}
                    readOnly
                    className="w-full border rounded p-2 min-h-[200px] bg-gray-100"
                />
            </div>
        </div>
    );
};

export default HTMLEditor;