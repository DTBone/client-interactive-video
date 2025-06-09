/* eslint-disable react/prop-types */
import styles from './OurCourses.module.scss';
import { alpha, styled } from '@mui/material/styles';
import Filter from './components/Filter';
import Course from './components/Course';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
function CoursesLayout({ courses, title, isFilter}) {
    const buttons = [
        {
            id: 0,
            name: 'New',
            onClick: () => console.log('All'),
        },
        {
            id: 1,
            name: 'Free Courses',
            onClick: () => console.log('Beginner'),
        },
        {
            id: 2,
            name: 'Pro Courses',
            onClick: () => console.log('Intermediate'),
        },
        {
            id: 3,
            name: 'Blog',
            onClick: () => console.log('Advanced'),
        },
    ];
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        border: '1px solid',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: '500px',
        },
      }));
      const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));
      const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '20ch',
          },
        },
      }));
    return ( 
        <>
        <div className={styles.container}>
            <h1>{title}</h1>
        </div>
        <div className={styles.containerCourses}>
        {isFilter && <div className={styles.filter}>
        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        <Filter buttons={buttons}/>
        </div>} 
        
        <div className={styles.courses}>
            {courses.map((course, index) => (
                <Course course={course} index= {index} key={course.id}/>
            ))}
        </div>
        </div>
        </>
     );
}

export default CoursesLayout;