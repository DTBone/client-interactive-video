import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

const HTMLEditor = ({
    handleProblemChange,
    value = '',
    field = 'content'
}) => {
    // State để lưu nội dung
    const [content, setContent] = useState('');

    // Ref cho editor
    const editor = useRef(null);

    // Cấu hình Jodit
    const config = {
        readonly: false, // Cho phép chỉnh sửa
        placeholder: 'Enter your description...',
        height: 400,
        minHeight: 400,
        maxHeight: 600,
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

        // Tạo một synthetic event để giả lập event của TextField
        if (handleProblemChange) {
            // Tạo synthetic event
            const syntheticEvent = {
                target: {
                    name: field,
                    value: newContent
                }
            };

            // Gọi hàm handleProblemChange
            handleProblemChange(syntheticEvent);
        }
    };

    // Sao chép mã HTML
    const copyHTML = () => {
        navigator.clipboard.writeText(content);

    };

    // Xóa nội dung
    const clearContent = () => {
        if (editor.current) {
            editor.current.value = '';
            setContent('');

            // Tạo synthetic event để xóa description
            const syntheticEvent = {
                target: {
                    value: ''
                }
            };
            handleProblemChange('description')(syntheticEvent);
        }
    };

    return (
        <div className="py-4 ">
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={handleContentChange}
                onChange={handleContentChange}
            />
        </div>
    );
};

export default HTMLEditor;