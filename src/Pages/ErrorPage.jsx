import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');

    let role = '';
    if (user) {
        const parsedUser = JSON.parse(user);
        role = parsedUser.role;
        console.log('role', role)
    }
    const handleClick = () => {
        switch (role) {
            case 'admin':
                navigate('/admin')
                break;
            case 'instructor':
                navigate('/instructor')
                break;
            case 'student':
                navigate('/homeuser')
                break;
            default:
                navigate('/home')
                break;
        }
    }
    return (
        <div className="flex flex-col justify-between items-center mt-5 w-screen h-100vh text-center space-y-2 h-full" >
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
                onClick={() => handleClick()}

            >
                GO TO HOMEPAGE
            </Button>

        </div>
    )
}

export default ErrorPage
