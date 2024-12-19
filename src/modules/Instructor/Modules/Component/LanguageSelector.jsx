import React, { useState } from 'react';
import { Button, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const LanguageSelector = ({ setLanguage, onLanguageChange }) => {
    // Default language is now passed via prop or defaulted to 'python'
    console.log('Default language: ', setLanguage);
    const [userLang, setUserLang] = useState(setLanguage || '');

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageSelect = (selectedLanguage) => {
        const mappedLang = languageMap[selectedLanguage];
        setUserLang(mappedLang);

        // Call the prop function to pass language back to parent
        if (onLanguageChange) {
            onLanguageChange(mappedLang);
        }

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
        <div className='py-2 flex flex-row'>
            <Typography>Selected language</Typography>
            <div>
                <Typography
                    variant="contained"
                    onClick={handleClick}
                    sx={{
                        textTransform: "capitalize",
                        color: '#2c7dff',
                        padding: '0.9em',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        '&:hover': {
                            background: '#becbd8',
                        },
                    }}
                >
                    {reverseLanguageMap[userLang]}
                    <KeyboardArrowDownIcon />
                </Typography>
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
            </div>
        </div>
    );
};

export default LanguageSelector;