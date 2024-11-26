import React from 'react'


import { Button, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getAllModulesByModuleItemId, getModuleById, getModuleByItemId } from "~/store/slices/Module/action.js";
import MenuList from './MenuList';
import ExpandBtn from '~/modules/Lesson/Button/ExpandBtn';
import HideBtn from '~/modules/Lesson/Button/HideBtn';


const SideBar = ({ handleSidebarButtonClick, isExpanded }) => {
    const pathSegments = window.location.pathname.split('/');
    const itemId = pathSegments[pathSegments.length - 1];
    console.log("Extracted ItemId:", itemId);

    //console.log("Sidebar itemId", itemId)
    const moduleId = window.location.pathname.split("/")[4]
    const dispatch = useDispatch()
    const { currentModule, loading } = useSelector((state) => state.module)
    const [module, setModule] = useState(currentModule);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getModuleByItemId({ itemId }));
                console.log("itemId", itemId)
            }
            catch (err) {
                console.error('Error:', err);
            }

        };
        fetchData()
    }, [dispatch, itemId])

    useEffect(() => {
        console.log("modules", currentModule)
        setModule(currentModule)
    }, [currentModule])
    const getModuleByModuleId = async () => {
        const result = await dispatch(getModuleById({ moduleId }))
        if (result.payload.success) {
            setModule(result.payload.data.module);
            console.log(module)
        }
    }
    useEffect(() => {
        getModuleByModuleId()
    }, [moduleId]);

    if (loading) {
        return <div>Loading...</div>
    }

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

export default SideBar
