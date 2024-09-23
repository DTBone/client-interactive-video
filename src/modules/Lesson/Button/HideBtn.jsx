import { Button } from "@mui/material"
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
const HideBtn = () => {
    return (
        <div>
            <Button

                sx={{
                    minWidth: 0,
                    padding: 1,
                    margin: 1,
                }}>
                <MenuOutlinedIcon />
            </Button>

        </div>
    )
}

export default HideBtn
