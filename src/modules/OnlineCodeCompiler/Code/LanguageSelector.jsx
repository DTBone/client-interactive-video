import React, { useState } from 'react';
import { Button, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const LanguageButtonSelector = ({ userLanguage, setUserLanguage }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        console.log(userLanguage);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setUserLanguage(selectedLanguage);
        handleClose();
    };

    const languages = ['Java', 'Python', 'C++', 'JavaScript'];

    return (
        <>
            <Typography
                variant="contained"
                onClick={handleClick}
                sx={{
                    textTransform: "capitalize", color: '#2c7dff', padding: '0.9em', borderRadius: '10px',
                    '&:hover': {
                        background: '#becbd8', // Hoặc bạn có thể sử dụng một màu cụ thể như '#4a90e2'
                    },
                }}
            >
                {userLanguage}
                < KeyboardArrowDownIcon />
            </Typography >
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ selectedIndex: -1 }}
            >
                <MenuList sx={{ border: "none" }}>
                    {languages.map((lang) => (
                        <MenuItem
                            key={lang}
                            onClick={() => handleLanguageSelect(lang)}
                        >
                            {lang}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </>
    );
};

export default LanguageButtonSelector;