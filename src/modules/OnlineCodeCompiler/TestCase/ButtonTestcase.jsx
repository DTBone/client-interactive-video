import { Button } from '@mui/material'
import React from 'react'

const ButtonTestcase = ({ index, handleClickTestcase, isSelected }) => {
    return (
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
            {`TestCase ${index + 1}`}
        </Button>
    )
}

export default ButtonTestcase