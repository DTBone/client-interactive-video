import React from 'react'
import { Button, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllModulesByModuleItemId, getModuleById, getModuleByItemId } from "~/store/slices/Module/action.js";
import ExpandBtn from '~/modules/Lesson/Button/ExpandBtn';
import HideBtn from '~/modules/Lesson/Button/HideBtn';
import MenuList from './MenuList';

const Sidebar = ({ handleSidebarButtonClick, isExpanded }) => {
    return (
        <Paper
            elevation={4}
            sx={{
                minHeight: '100vh',
                width: isExpanded ? 260 : 64,
                transition: 'width 0.3s',
                borderRadius: 3,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                p: isExpanded ? 2 : 1,
                alignItems: 'center',
            }}
        >
            <div onClick={handleSidebarButtonClick} style={{ marginBottom: 16, cursor: 'pointer' }}>
                {isExpanded ? <ExpandBtn /> : <HideBtn />}
            </div>
            {isExpanded ? <MenuList /> : null}
        </Paper>
    )
}

export default Sidebar
