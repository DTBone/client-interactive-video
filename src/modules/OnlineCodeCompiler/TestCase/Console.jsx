import React, { useEffect, useState } from 'react'
import { useCode } from '../CodeContext'
import { Typography } from '@mui/material';
import spinnerLoading from '~/assets/spinnerLoading.gif';

const Console = () => {
    const { userInput, userOutput, loading } = useCode();

    const ConsoleValue = [
        { label: "Input", value: userInput },
        { label: "Output", value: userOutput },
    ];
    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center h-1/4">
                    <div className="m-auto">

                        <img src={spinnerLoading} alt="Loading..." />
                    </div>
                </div>
            ) :
                (
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <div className="grid grid-cols-[1fr,9fr] gap-4 p-4">
                            {ConsoleValue.map(({ label, value }) => (
                                <React.Fragment key={label}>
                                    <Typography variant="body1" className="font-semibold">{label}</Typography>
                                    <Typography variant="body2">{value}</Typography>
                                </React.Fragment>
                            ))}
                        </div>
                    </div >
                )}
        </div >
    )
}

export default Console