import React, { useState } from 'react';
import { Button, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCode } from '../CodeContext';

const LanguageButtonSelector = () => {
    const { userLang, setUserLang } = useCode();
    //console.log('userLang:', userLang);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        console.log(userLang);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSelect = (selectedLanguage) => {
        const mappedLang = languageMap[selectedLanguage];
        setUserLang(mappedLang);
        //console.log(mappedLang)
        handleClose();
    };

    const languages = ['Java', 'Python', 'C++', 'C'];
    const languageMap = {
        'Java': 'java',
        'Python': 'python',
        'C++': 'cpp',
        'C': 'c'
    };

    const reverseLanguageMap = {
        'java': 'Java',
        'python': 'Python',
        'cpp': 'C++',
        'c': 'C'
    };

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
                {reverseLanguageMap[userLang]}
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