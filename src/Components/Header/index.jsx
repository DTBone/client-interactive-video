/* eslint-disable react/prop-types */
import styles from './Header.module.scss';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';
import AvatarProfile from './components/Profile';
import logo from '../../assets/logo_codechef.png';
// import { SearchIcon } from 'lucide-react';
import { TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { setSearchQuery } from '~/store/slices/SearchCourseForUser/searchSlice';
import { useLazySearchCoursesQuery } from '~/store/slices/SearchCourseForUser/searchCourseAPI';

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1])); // Giải mã payload từ base64
    } catch (e) {
        return null;
    }
}

function Header({ isLogin, user, setSearch }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //console.log(localStorage.getItem("token"));  // Kiểm tra trong Local Storage
    //console.log(localStorage.getItem("user"));  // Kiểm tra trong Local Storage

    const token = localStorage.getItem("token");

    if (token) {
        const decodedData = parseJwt(token);
        console.log(decodedData); // In ra nội dung payload của JWT
    } else {
        console.log("Token không tồn tại!");
    }

    const [searchCourses, { data, isLoading, error }] = useLazySearchCoursesQuery();
    if (!isLogin) {
        isLogin = false;
    }
    if (localStorage.getItem("token")) {
        isLogin = true;
    }

    if (!user && localStorage.getItem("user")) {
        user = JSON.parse(localStorage.getItem('user'));

    }
    else {
        user =
        {
            username: 'Guest',
            email: '',
            profile: {
                picture: ''
            },

        }
    }


    const handleClick = () => {
        window.location.href = '/homeuser';
    }

    const [value, setValue] = useState('');

    const handleSubmit = async () => {
        if (value.trim()) {
            try {
                // Lưu giá trị tìm kiếm
                const searchValue = value;

                // Thực hiện tìm kiếm trước khi chuyển hướng
                // const result = await searchCourses(searchValue).unwrap();

                // Sau khi có kết quả, mới cập nhật Redux và chuyển hướng
                dispatch(setSearchQuery(searchValue));

                // Xóa giá trị input
                setValue('');

                // Chuyển hướng sau cùng
                navigate(`/search?q=${encodeURIComponent(searchValue)}`);
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            }
        }
    };
    return (
        <div className="flex flex-row items-center justify-between w-full h-[60px] bg-[#fffffa] gap-8 px-6">

            <div className="w-10 h-10" onClick={() => handleClick()}>
                <img src={logo} alt="logo" />
            </div>

            <TextField
                id="search-field"
                placeholder="What do you want to learn?"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit();
                        e.target.blur();
                    }
                }}
                autoComplete="off"
                sx={{
                    width: '100%',
                    maxWidth: '560px',
                    backgroundColor: 'white',
                    overflow: 'hidden',
                    borderRadius: '28px',
                    margin: 0,
                    padding: 0,

                    '& .MuiOutlinedInput-root': {
                        borderRadius: '28px',
                        height: '46px',
                        paddingRight: '8px',
                        '& fieldset': {
                            borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#bdbdbd',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#bdbdbd',
                        },
                    },
                    '& input:-webkit-autofill': {
                        //backgroundColor: 'white !important', // Giữ màu nền trắng
                        WebkitBoxShadow: '0 0 0px 1000px white inset', // Chặn màu nền autofill
                        transition: 'background-color 5000s ease-in-out 0s', // Giữ màu nền không đổi
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleSubmit}
                                sx={{
                                    backgroundColor: theme => theme.palette.primary.main,
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    },
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                variant="outlined"
            />

            {!isLogin && <div className={styles.groupButton}>

                <Link to='/signin' className={styles.logIn} >Log In</Link>
                <Link to='/signup' className={styles.signUp}>Sign Up</Link>
            </div>}
            {isLogin && <div className={styles.groupButton}>
                <AvatarProfile user={user} />
            </div>}
        </div>

    );
}

export default Header;