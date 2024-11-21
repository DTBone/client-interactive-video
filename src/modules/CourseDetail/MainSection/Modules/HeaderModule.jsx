import { Typography } from "@mui/material"
import IconComponent from "../../../../Components/Common/Button/IconComponent"


const HeaderModule = ({ content }) => {
    return (
        <div className="pl-4 pb-3 mt-1 ml-5 space-x-3 flex flex-row justify-start items-center">
            {content && content.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <IconComponent fontSize='10px' icon={item.icon} />
                    <Typography sx={{ fontSize: '10px' }}>{item.title}</Typography>
                </div>
            ))}
        </div>
    )
}

export default HeaderModule
