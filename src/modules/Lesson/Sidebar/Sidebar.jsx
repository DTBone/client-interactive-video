import ExpandBtn from "../Button/ExpandBtn"
import HideBtn from "../Button/HideBtn"
import { Button, Typography } from "@mui/material";
import MenuItem from "./MenuList";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import MenuList from "./MenuList";
import {useDispatch} from "react-redux";
import {getModuleById} from "~/store/slices/Module/action.js";

const moduleSample = {
    title: "Merge Sort Algorithm",
    moduleItems: [
        {
            id: "1",
            title: "Overview",
            type: "supplement",
            contentType: "Reading",
            icon: "read",
            status: "completed",
            note: "",
            difficulty: "medium",
            references: [
                {
                    title: "Tài liệu tham khảo 1",
                    link: "https://example.com"
                }]
        },
        {
            id: "2",
            title: "Mergesort",
            type: "lecture",
            contentType: "Video",
            icon: "video",
            status: "",
            note: "",
            difficulty: "medium",
            references: [
                {
                    title: "Link video",
                    link: "https://example.com"
                }
            ]
        },
        {
            id: "3",
            title: "Mergesort algorithm ",
            type: "quiz",
            contentType: "Practice Quiz",
            icon: "quiz",
            status: "",
            note: "3 min",
            difficulty: "medium",
            references: [
                {
                    title: "Tài liệu tham khảo 1",
                    link: "https://example.com"
                }
            ]
        },
        {
            id: "4",
            title: "Merge Sort Code",
            type: "programming",
            contentType: "Programming Assignment",
            icon: "code",
            status: "",
            note: "",
            difficulty: "medium",
            references: [
                {
                    title: "Tài liệu tham khảo 1",
                    link: "https://example.com"
                }
            ]
        }
    ]
}

const Sidebar = ({ handleSidebarButtonClick, isExpanded }) => {
    const moduleId = window.location.pathname.split("/")[4]
    const [module, setModule] = useState(moduleSample)
    const dispatch = useDispatch()
    const getModuleByModuleId = async () =>{
        const result = await dispatch(getModuleById({moduleId}))
        if(result.payload.success){
            setModule(result.payload.data.module);
            console.log(module)
        }
    }
    useEffect(() => {
        getModuleByModuleId()
    }, [moduleId]);



    return (
        <div style={{
            //width: isExpanded ? `${sidebarWidth}px` : '55px',
            //minWidth: isExpanded ? `${sidebarWidth}px` : '55px',
            //transition: 'width 0.01s, min-width 0.3s',
        }} className="flex flex-col ">
            <div onClick={handleSidebarButtonClick} className="flex items-center justify-center">
                {isExpanded ?
                    (<ExpandBtn />) : (<HideBtn />) // change the button based on the state
                }
            </div>
            {isExpanded ? (<MenuList module={module}  />) : null}


        </div>
    )
}

export default Sidebar
