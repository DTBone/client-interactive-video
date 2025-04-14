import React from 'react';

export function CircularSpinner({ size = 1, useAlternativeColor = false }) {
    const borderColorClass = useAlternativeColor
        ? "border-blue-500 dark:border-blue-400 border-t-blue-700 dark:border-t-blue-200"
        : "border-green-500 dark:border-green-700 border-t-green-700 dark:border-t-green-500";

    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full border-2 ${borderColorClass}`}
                style={{ width: `${size}em`, height: `${size}em` }}
            ></div>
        </div>
    );
}