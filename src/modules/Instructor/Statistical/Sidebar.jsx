import React from 'react'


import { Button, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getAllModulesByModuleItemId, getModuleById, getModuleByItemId } from "~/store/slices/Module/action.js";

import ExpandBtn from '~/modules/Lesson/Button/ExpandBtn';
import HideBtn from '~/modules/Lesson/Button/HideBtn';
import MenuList from './MenuList';


const Sidebar = ({ handleSidebarButtonClick, isExpanded }) => {
    const pathSegments = window.location.pathname.split('/');
    const itemId = pathSegments[pathSegments.length - 1];
    console.log("Extracted ItemId:", itemId);

    const dispatch = useDispatch()


    return (
        <div>
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
                {isExpanded ? (<MenuList />) : null}


            </div>
        </div>
    )
}

export default Sidebar
