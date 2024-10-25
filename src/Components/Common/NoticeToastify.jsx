import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoticeToastify = ({ status, content }) => {
    // Cấu hình mặc định cho toast
    const toastConfig = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    };

    // Hiển thị toast dựa vào status
    useEffect(() => {
        if (!content) return;

        switch (status) {
            case 'warning':
                toast.warn(content, toastConfig);
                break;
            case 'info':
                toast.info(content, toastConfig);
                break;
            case 'success':
                toast.success(content, toastConfig);
                break;
            case 'error':
                toast.error(content, toastConfig);
                break;
            default:
                toast(content, toastConfig);
        }
    }, [status, content]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
};

export default NoticeToastify;