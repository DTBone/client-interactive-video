/* eslint-disable react/prop-types */
import { Typography } from "@mui/material"
import IconComponent from "../../../../Components/Common/Button/IconComponent"
import {useLocation, useNavigate} from "react-router-dom";
import {CheckCircle} from "@mui/icons-material";
const ModuleItem = ({ item }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const module = location.state?.module;
    const courseId = module.courseId
    const handleClick = () => {
        console.log(item)
        if (item.type === 'quiz')
        navigate(`/learns/${courseId}/lessons/${item.module}/${item.type}/${item.quiz}`)
        else if (item.type === 'lecture')
        navigate(`/learns/${courseId}/lessons/${item.module}/${item.type}/${item._id}`)
        else if (item.type === 'supplement')
            navigate(`/learns/${courseId}/lessons/${item.module}/${item.type}/${item.video}`)
        else if (item.type === 'programming')
            navigate(`/learns/${courseId}/lessons/${item.module}/${item.type}/${item.programming._id}`)
    }
    return (
        <div onClick={handleClick} className="w-full flex flex-row justify-start items-center space-x-3 hover:bg-[#f2f5fa] p-1 ">
            <IconComponent icon={item.icon} />
            <div>
                <Typography sx={{ textTransform: 'capitalize' }}> {item.title}</Typography>
                <Typography fontSize='14px' color='#5b6790' sx={{ textTransform: 'capitalize' }}>{item.type}</Typography>
            </div>
            {item.status === 'completed' && <CheckCircle color='success'/>}
        </div >
    )
}

export default ModuleItem
