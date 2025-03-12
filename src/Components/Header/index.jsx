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
import { useLazySearchCoursesQuery } from '~/store/slices/SearchCourseForUser/action';

function Header({ isLogin, user, setSearch }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchCourses, { data, isLoading, error }] = useLazySearchCoursesQuery();
    if (!isLogin) {
        isLogin = false;
    }
    if (!user) {
        user =
        {
            username: 'Guest',
            email: '',
            profile: {
                picture: ''
            },

        }
    }

    const handleSearchChange = (value) => {
        dispatch(setSearchQuery(value));
        navigate(`/search?q=${encodeURIComponent(value)}`);

    }

    const handleClick = () => {
        window.location.href = '/homeuser';
    }

    const [value, setValue] = useState('');

    const handleSubmit = () => {


        if (value.trim()) {
            handleSearchChange(value);
            //searchCourses(value);
        }
        setValue('');
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* <div className={styles.background}></div> */}
                <div className={styles.header}>
                    <div className={styles.logo} onClick={() => handleClick()}>
                        <img src={logo} alt="logo" />
                    </div>
                    {!isLogin ? <Navbar /> :
                        // <TextField
                        //     id="input-with-icon-textfield"
                        //     label="Search"
                        //     size="small"
                        //     onKeyDown={
                        //         (e) => {
                        //             if (e.key === 'Enter') {
                        //                 handleSearchChange(e.target.value);
                        //                 e.target.value = '';
                        //                 e.target.blur();
                        //             }
                        //         }
                        //     }
                        //     sx={{
                        //         width: '400px',
                        //     }}
                        //     slotProps={{
                        //         input: {
                        //             startAdornment: (
                        //                 <InputAdornment position="start">
                        //                     <SearchIcon />
                        //                 </InputAdornment>
                        //             ),
                        //         },
                        //     }}
                        //     variant="filled"
                        // />
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
                            sx={{
                                width: '100%',
                                maxWidth: '560px',
                                backgroundColor: 'white',
                                borderRadius: '28px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '28px',
                                    height: '56px',
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
                                                backgroundColor: '#1a73e8',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
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
                    }
                    {!isLogin && <div className={styles.groupButton}>

                        <Link to='/signin' className={styles.logIn} >Log In</Link>
                        <Link to='/signup' className={styles.signUp}>Sign Up</Link>
                    </div>}
                    {isLogin && <div className={styles.groupButton}>
                        <AvatarProfile user={user} />
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default Header;