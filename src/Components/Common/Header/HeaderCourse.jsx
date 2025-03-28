import React from 'react'
import { useFormik } from "formik"
import * as Yup from "yup"
import { Box, Button, Divider } from '@mui/material'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { clearState } from '~/store/slices/Auth/authSlice';

const validationSchema = Yup.object().shape({
    keyword: Yup.string().required("Keyword is required"),
});
const HeaderCourse = () => {
    const getUserFromStorage = () => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    };
    const user = getUserFromStorage() || '';
    const formik = useFormik({
        initialValues: {
            keyword: "",
        },
        validationSchema,
        onSubmit: (values) => {

            console.log("form value", values);
        },
    });

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleNavigation = (path) => {
        //console.log(path);
        navigate(path);
        handleCloseMenu();

    }
    const handleHomeClick = () => {

    };
    const handleLogout = () => {
        dispatch(clearState());
        navigate('/signin');
    };


    return (
        <div>
            <div className="flex flex-row justify-between  pt-1 pb-1 pr-1 items-center ml-5">
                <div className=" flex flex-row h-1/6 w-3/4 ">

                    <div className="font-bold text-3xl text-[#0056d2]  mr-5 ">codechef</div>
                    <form onSubmit={formik.handleSubmit} className='w-3/4 flex items-center'>

                        <input
                            type="text"
                            aria-label="searchbox"
                            name="keyword"
                            value={formik.values.keyword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Search in course"
                            className="rounded-s-md bg-transparent border-black border-t-2 border-s-2 border-b-2 p-2  w-2/4 h-full focus:border-[#0056d2] focus:outline-none"
                        />

                        <Button
                            variant='contained'
                            type="submit"
                            // onClick={() => handleNavigation(`/profile`)}
                            sx={{
                                height: "100%",
                                borderTopLeftRadius: '0px',
                                borderBottomLeftRadius: '0px',
                                background: "#0056d2",
                                textTransform: 'none',
                                '&:hover': {
                                    background: "#0067fc",
                                },
                            }}>Search</Button>

                    </form>
                </div>
                <div className="w-1/4  flex flex-row justify-end items-center   space-x-2">
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <div className='p-2 hover:bg-[#f0f6ff] rounded-lg text-[#1a1a1a] '>
                            <NotificationsActiveOutlinedIcon className="focus:text-[#bed5f2] " fontSize="medium" />

                        </div>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <div className='w-16  ps-4 pe-6 hover:bg-[#f0f0f0] '>

                            <Avatar
                                className="transform -translate-y-24"
                                alt="Avater User"
                                src="/chef.svg"
                                sx={{ width: "36px", height: "36px", border: "4px solid white" }}
                                id="avt-button"
                                aria-controls={open ? 'avt-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            />
                            <Menu
                                autoFocus={false}
                                id="avt-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                    'aria-labelledby': 'avt-button',
                                }}
                                sx={{
                                    width: "20rem",
                                }}
                                PaperProps={{
                                    style: {
                                        paddingTop: "0",
                                        width: 180,
                                    },
                                }}
                            >
                                <MenuItem onClick={() => handleNavigation(`/profile`)}>Profile</MenuItem>
                                {user.role === "instructor" ? (
                                    <MenuItem onClick={() => handleNavigation(`/course-management`)}>
                                        Course Management
                                    </MenuItem>
                                ) : user.role === "student" ? (
                                    <MenuItem onClick={() => handleNavigation(`/learning`)}>
                                        My Learning
                                    </MenuItem>
                                ) : (
                                    <MenuItem onClick={() => handleNavigation(`/account`)}>
                                        Account
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Box>


                    {/* <Switcher /> */}
                </div>

            </div>
            <Divider />
        </div>
    )
}

export default HeaderCourse
