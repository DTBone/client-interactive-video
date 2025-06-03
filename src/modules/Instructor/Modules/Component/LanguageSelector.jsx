import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, MenuList, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const LanguageSelector = ({ setLanguage, onLanguageChange }) => {
  // Default language is now passed via prop or defaulted to 'python'
  console.log("Default language: ", setLanguage);
  const [userLang, setUserLang] = useState(setLanguage || "python");

  // Sync userLang state với setLanguage prop khi prop thay đổi
  useEffect(() => {
    if (setLanguage && setLanguage !== userLang) {
      console.log("Syncing language from prop:", setLanguage);
      setUserLang(setLanguage);
    }
  }, [setLanguage, userLang]);

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
    console.log("Language selected:", selectedLanguage, "->", mappedLang);
    setUserLang(mappedLang);

    // Call the prop function to pass language back to parent
    if (onLanguageChange) {
      onLanguageChange(mappedLang);
    }

    handleClose();
  };

  const languages = ["Java", "Python", "C++", "C"];

  const languageMap = {
    Java: "java",
    Python: "python",
    "C++": "cpp",
    C: "c",
  };

  const reverseLanguageMap = {
    java: "Java",
    python: "Python",
    cpp: "C++",
    c: "C",
  };

  return (
    <div className="py-2 flex flex-row items-center gap-2">
      <Typography className="mr-2">Selected language:</Typography>
      <div>
        <Typography
          variant="contained"
          onClick={handleClick}
          sx={{
            textTransform: "capitalize",
            color: "#2c7dff",
            padding: "0.6em 1em",
            borderRadius: "8px",
            cursor: "pointer",
            border: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            "&:hover": {
              background: "#e5e7eb",
            },
          }}
        >
          {reverseLanguageMap[userLang] || "Python"}
          <KeyboardArrowDownIcon sx={{ ml: 1 }} />
        </Typography>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ selectedIndex: -1 }}
        >
          <MenuList sx={{ border: "none", minWidth: 120 }}>
            {languages.map((lang) => (
              <MenuItem
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                selected={languageMap[lang] === userLang}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                  },
                }}
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

LanguageSelector.propTypes = {
  setLanguage: PropTypes.string,
  onLanguageChange: PropTypes.func,
};

export default LanguageSelector;
