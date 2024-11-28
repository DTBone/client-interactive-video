import React, { useEffect, useState } from 'react'
import { useCode } from '../CodeContext'
import { Typography } from '@mui/material';
import spinnerLoading from '~/assets/spinnerLoading.gif';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '~/hooks/useNotification';
import { getProgramming } from '~/store/slices/Compile/action';
import { useParams } from 'react-router-dom';
import compile from './../Code/Compile';

const Console = () => {
    const { userInput, userOutput, loading } = useCode();
    const { compile, error, submission, problem } = useSelector((state) => state.compile);
    const { showNotice } = useNotification();
    const dispatch = useDispatch();
    const { problemId } = useParams();

    const [ConsoleValue, setConsoleValue] = useState([
        { label: "Input", value: problem?.inputFormat },
        { label: "Output", value: compile?.output },
    ]);

    useEffect(() => {
        if (error) {
            showNotice('error', error.message);
        }
    }, [error]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                //dispatch(getProgramming({ problemId }));
                setConsoleValue([
                    { label: "Input", value: problem?.inputFormat },
                    { label: "Output", value: compile?.output }
                ]);
            } catch (error) {
                console.error("Fetch data error:", error);
            }
        };

        fetchData();
    }, [dispatch, compile]);

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
