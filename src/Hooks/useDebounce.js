import { useState, useEffect } from 'react';

/**
 * Custom hook để debounce giá trị
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian delay tính bằng milliseconds
 * @returns {any} Giá trị đã được debounce
 */
const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Tạo timeout để delay việc cập nhật giá trị
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function để clear timeout nếu value thay đổi
        // trước khi delay kết thúc
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;