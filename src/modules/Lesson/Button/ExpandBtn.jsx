import { Button } from "@mui/material"
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const ExpandBtn = () => {
    return (
        <div className="">
            <Button

                sx={{
                    minWidth: 0,
                    padding: 1,
                    margin: 1,
                    fontWeight: "bold",
                    '&:hover': {
                        textDecoration: "underline"
                    },
                }}>
                <MenuOutlinedIcon sx={{ paddingEnd: 2 }} />
                Hide Menu
            </Button>
        </div >
    )
}

export default ExpandBtn
