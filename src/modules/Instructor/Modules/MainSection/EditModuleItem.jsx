import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom';
import { Modal } from '@mui/material';
import EditSupplement from '../Component/EditSupplement';
import EditLecture from '../Component/EditLecture';
import EditQuiz from '../Component/EditQuiz';
import EditProgramming from '../Component/EditProgramming';
import { getModuleItemById } from '~/store/slices/ModuleItem/action';
import spinnerLoading from '~/assets/spinnerLoading.gif';

const EditModuleItem = () => {
    const dispatch = useDispatch();
    const { currentItem, loading, error } = useSelector((state) => state.moduleItem);
    const [moduleItem, setModuleItem] = useState('');

    const moduleItemId = useParams();
    useEffect(() => {
        if (moduleItemId) {
            dispatch(getModuleItemById(moduleItemId));
        }
    }, [moduleItemId])

    useEffect(() => {
        //setModuleItem(null);
        // Kiểm tra cấu trúc dữ liệu chi tiết
        //console.log('Current Item Full:', currentItem);
        console.log('Current Item Data:', currentItem?.data);

        if (currentItem?.data) {
            // Nếu data không phải là đối tượng gốc, thử truy cập đúng
            setModuleItem(currentItem.data);
        } else if (currentItem) {
            // Nếu currentItem là đối tượng gốc
            setModuleItem(currentItem);
        }
    }, [currentItem])
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <img alt="Loading" src={spinnerLoading} />
            </div>
        );
    }
    const renderContentComponent = () => {
        if (!moduleItem) return null;
        switch (moduleItem.type) {
            case 'supplement':
                return <EditSupplement moduleItem={moduleItem} />;
            case 'lecture':
                return <EditLecture moduleItem={moduleItem} />;
            case 'quiz':
                return <EditQuiz moduleItem={moduleItem} />;
            case 'programming':
                return <EditProgramming moduleItem={moduleItem} />;
            default:
                return null;
        }

    }
    return (
        <div>
            {renderContentComponent()}

        </div>
    )
}

export default EditModuleItem
