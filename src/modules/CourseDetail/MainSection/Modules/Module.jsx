
import { Typography, List, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import HeaderModule from './HeaderModule';
import ModuleItem from './ModuleItem';
import { useLocation } from 'react-router-dom';
import { getModuleById } from "~/store/slices/Module/action.js";
import { useDispatch, useSelector } from "react-redux";
import { useNotification } from '~/hooks/useNotification';

const Module = () => {
    const [isOpen, setIsOpen] = useState(true);
    const dispatch = useDispatch();
    const { showNotice } = useNotification();
    const location = useLocation();
    const module = location.state?.module;
    const [detailModule, setDetailModule] = useState(null);

    const { currentItem, loading, error, refresh } = useSelector((state) => state.moduleItem);

    const getModuleByModuleId = async () => {
        const result = await dispatch(getModuleById({ moduleId: module?._id }));
        if (result.payload.success) {
            setDetailModule(result.payload.data.module);
            console.log("module", result.payload.data.module)
        }
    }
    useEffect(() => {
        getModuleByModuleId()
    }, [module, currentItem]);

    useEffect(() => {
        if (error) {
            console.log("error", error);
            showNotice('error', error);
            //return;
        }
    }, [error])

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden hover:border-sky-200">
            <div
                className="flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-[#f0f6ff]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-2 ">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    <span className="font-semibold">{module?.title}</span>
                </div>

            </div>
            {isOpen && (
                <div className=" bg-transparent ">
                    <div className="">
                        {/*<HeaderModule content={module.description} />*/}
                        <Divider />
                    </div>
                    <div className="p-4 ml-5">
                        <Typography >{module?.description}</Typography>
                        <List>
                            {detailModule?.moduleItems && detailModule.moduleItems.map((item, index) => (
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
