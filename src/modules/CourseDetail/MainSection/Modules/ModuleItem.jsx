import { Typography } from "@mui/material"
import IconComponent from "../../../../Components/Common/Button/IconComponent"

const ModuleItem = ({ item }) => {
    return (
        <div className="w-full flex flex-row justify-start items-center space-x-3 hover:bg-[#f2f5fa] p-1 ">
            <IconComponent icon={item.icon} />
            <div>
                <Typography sx={{ textTransform: 'capitalize' }}> {item.title}</Typography>
                <Typography fontSize='14px' color='#5b6790' sx={{ textTransform: 'capitalize' }}>{item.type}</Typography>
            </div>
        </div >
    )
}

export default ModuleItem
