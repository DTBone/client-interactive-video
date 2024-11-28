import React from 'react';
import { Button, Typography, Divider } from "@mui/material";
import { Code2 } from "lucide-react";
import LanguageButtonSelector from "./LanguageSelector";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import compile from './Compile';
import { useCode } from '../CodeContext';
import { useNotification } from '~/hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { compileRunCode } from '~/store/slices/Compile/action';
import { useParams } from 'react-router-dom';

const Navbar = () => {
    //const context = useCode();
    // console.log('Context in Navbar:', context);
    const { userLang, setLoading, setUserOutput, userCode, userInput } = useCode();
    const { compile, loading, error, submission, problem } = useSelector((state) => state.compile);
    const { showNotice } = useNotification();
    const dispatch = useDispatch();
    const { problemId } = useParams();
    const handleRunCodeClick = () => {
        setLoading(true);
        if (!userLang || !userCode) {
            showNotice('error', 'Please select language and write code before running!');
            return;
        }
        dispatch(compileRunCode({ userCode, userLang, userInput: problem?.inputFormat, itemId: problemId }))
            .then(() => {
                setLoading(false); // Set loading to false after successful run
            })
            .catch(() => {
                setLoading(false); // Set loading to false after error
            });
    }
    // console.log('userLang:', userLang, 'userCode:', userCode);
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row items-center h-5 bg-[#fafafa] w-full px-4">
                <Code2 color="#003cff" />
                <Typography
                    fontSize="1.2rem"
                    fontWeight="bold"
                    sx={{
                        color: "black", marginLeft: 2,
                        '&:hover': {
                            color: 'primary.main', // Hoặc bạn có thể sử dụng một màu cụ thể như '#4a90e2'
                        },
                    }}
                >
                    Code
                </Typography>
            </div>

            <div className="flex flex-row justify-between items-center px-4 py-2 h-">
                <div className="flex-grow">
                    <LanguageButtonSelector />
                </div>

                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleRunCodeClick()}
                        sx={{
                            mr: 1, background: "#e5e6e8", width: "7rem", height: "2rem", color: "#000000",
                            '&:hover': {
                                background: "#fafbfe",
                                // Hoặc bạn có thể sử dụng một màu cụ thể như '#4a90e2'
                            },
                        }}
                    >
                        <PlayArrowIcon sx={{ marginRight: "0.8rem" }} />
                        Run
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"

                        sx={{
                            background: "#0037eb", width: "7rem", height: "2rem", color: "#FFFFFF",
                            '&:hover': {
                                background: "#0080ff",
                                // Hoặc bạn có thể sử dụng một màu cụ thể như '#4a90e2'
                            },
                        }}
                    >
                        <CloudDoneIcon color="white" sx={{ marginRight: "0.8rem" }} />
                        Submit
                    </Button>
                </div>
            </div>
            <Divider flexItem sx={{ width: "100%" }} />
        </div>
    );
};

export default Navbar;