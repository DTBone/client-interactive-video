import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { Typography } from '@mui/material';

const HTMLEditor = ({
    handleProblemChange, // Hàm xử lý thay đổi nội dung
    value = '', // Nội dung ban đầu
    field = 'content' // Tên trường nội dung
}) => {
    // State để lưu nội dung
    const [content, setContent] = useState('');

    // Ref cho editor
    const editor = useRef(null);

    // Cấu hình Jodit
    const config = {
        readonly: false, // Cho phép chỉnh sửa
        placeholder: 'Enter your HTML content...',
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
        if (handleProblemChange) {
            handleProblemChange(newContent); // 👈 Chỉ truyền string
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
            <Typography variant="h6" gutterBottom>HTML Content (Optional)</Typography>
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onChange={handleContentChange}
            />
        </div>
    );
};

export default HTMLEditor;