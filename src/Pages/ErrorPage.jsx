import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-between items-center mt-5 w-screen h-screen text-center space-y-2 h-full" >
            <img className="flex space-x-5 items-center w-1/2 max-w-sm h-1/2 max-h-sm" src="/error-oop.svg" alt="404 error" />
            <h1 className="text-center text-3xl font-bold text-gray-900">404 - PAGE NOT FOUND!</h1>
            <p className="text-lg w-1/3">The page you are looking for might have been removed had its name changed or is temporarily unavailable</p>
            <Button
                sx={{
                    width: "200px",
                    borderRadius: "20px",
                    paddingY: "8px",
                    paddingX: "20px",
                    color: "#FFFFFF",
                    bgcolor: "#1e88e5",
                    '&:hover': {

                        bgcolor: "#13a4ff",
                    }

                }}
                onClick={() => navigate(`/home`)}

            >
                GO TO HOMEPAGE
            </Button>

        </div>
    )
}

export default ErrorPage
