import React from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Programming = () => {
    const navigate = useNavigate();
    const problemId = "sorting_problem";

    const handleCodeClick = () => {
        const url = `/problems/${problemId}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <Button
                onClick={handleCodeClick}
                variant="contained"
                color="primary"
            >
                Go to Code Compiler
            </Button>
        </div>
    );
};

export default Programming;