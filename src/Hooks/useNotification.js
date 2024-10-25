import { useCallback } from 'react';
import { toast } from 'react-toastify';

const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light"
};

export const useNotification = () => {
    const showNotice = useCallback((status, message) => {
        switch (status) {
            case 'error':
                toast.error(message, toastConfig);
                break;
            case 'success':
                toast.success(message, toastConfig);
                break;
            case 'warning':
                toast.warning(message, toastConfig);
                break;
            case 'info':
                toast.info(message, toastConfig);
                break;
            default:
                toast(message, toastConfig);
        }
    }, []);

    return { showNotice };
};