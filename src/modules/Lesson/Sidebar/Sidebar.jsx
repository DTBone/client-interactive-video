import ExpandBtn from "../Button/ExpandBtn"
import HideBtn from "../Button/HideBtn"
import { Button, Typography } from "@mui/material";
import MenuItem from "./MenuList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuList from "./MenuList";

const Sidebar = ({ handleSidebarButtonClick, isExpanded }) => {



    const module = {
        title: "Merge Sort Algorithm",
        moduleItem: [
            {
                id: "1",
                name: "Overview",
                navigation: "supplement",
                type: "Reading",
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
                name: "Mergesort",
                navigation: "lecture",
                type: "Video",
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
                name: "Mergesort algorithm ",
                navigation: "quiz",
                type: "Practice Quiz",
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
                name: "Merge Sort Code",
                navigation: "programming",
                type: "Programming Assignment",
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




    return (
        <div style={{
            //width: isExpanded ? `${sidebarWidth}px` : '55px',
            //minWidth: isExpanded ? `${sidebarWidth}px` : '55px',
            //transition: 'width 0.01s, min-width 0.3s',
        }} className="flex flex-col w-full">
            <div onClick={handleSidebarButtonClick} className="flex items-center justify-center">
                {isExpanded ?
                    (<ExpandBtn />) : (<HideBtn />) // change the button based on the state
                }
            </div>
            {isExpanded ? (<MenuList module={module} />) : null}
            {isExpanded ? (<MenuList module={module} />) : null}
            {isExpanded ? (<MenuList module={module} />) : null}

        </div>
    )
}

export default Sidebar
