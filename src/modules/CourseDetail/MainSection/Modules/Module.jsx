
import { Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { PlayCircle, Article, QuizOutlined, Code, Assignment } from '@mui/icons-material';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import HeaderModule from './HeaderModule';
import ModuleItem from './ModuleItem';

const IconComponent = ({ icon }) => {
    switch (icon) {
        case 'video': return <PlayCircle />;
        case 'read': return <Article />;
        case 'quiz': return <QuizOutlined />;
        case 'code': return <Code />;
        case 'assignment': return <Assignment />;
        default: return null;
    }
};
const Module = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const module = location.state?.module;
    return (
        <div className="border border-gray-200 rounded-md overflow-hidden hover:border-sky-200">
            <div
                className="flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-[#f0f6ff]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-2 ">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    <span className="font-semibold">{module.name}</span>
                </div>

            </div>
            {isOpen && (
                <div className=" bg-transparent">
                    <div>
                        <HeaderModule content={module.content} />

                        <Divider />
                    </div>
                    <div className="p-4">
                        <Typography >{module.description}</Typography>
                        <List>
                            {module.item.map((item, index) => (
                                <ModuleItem item={item} key={index} />
                            ))}
                        </List>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Module