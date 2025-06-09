import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChatIcon from '@mui/icons-material/Chat';

const IconComponent = ({ icon }) => {
    switch (icon) {
        case 'video': return <PlayCircleOutlineOutlinedIcon />;
        case 'read': return <ArticleOutlinedIcon />;
        case 'quiz': return <QuizOutlinedIcon />;
        case 'code': return <CodeOutlinedIcon />;
        case 'assignment': return <AssignmentOutlinedIcon />;
        case 'course': return <LibraryBooksIcon />;
        case 'mess': return <ChatIcon />
        default: return null;
    }

};

export default IconComponent
