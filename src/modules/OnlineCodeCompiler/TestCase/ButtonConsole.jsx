import { Button } from '@mui/material'

const ButtonConsole = ({ index, handleClickTestcase, isSelected }) => {
    return (
        <div>
            <Button
                variant="text"
                onClick={() => handleClickTestcase(index)}
                sx={{
                    width: "7rem",
                    height: "2rem",
                    borderRadius: "0rem",
                    borderBottom: isSelected ? '2px solid black' : 'none',
                    '&:hover': {
                        borderBottom: '1px solid black',
                    },
                    '&:focus': {
                        borderBottom: '1px solid black',
                    }
                }}>
                Console
            </Button>
        </div>
    )
}

export default ButtonConsole
