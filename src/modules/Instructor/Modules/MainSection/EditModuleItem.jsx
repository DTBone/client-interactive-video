import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom';
import { Modal } from '@mui/material';
import EditSupplement from '../Component/EditSupplement';
import EditLecture from '../Component/EditLecture';
import EditQuiz from '../Component/EditQuiz';
import EditProgramming from '../Component/EditProgramming';
import { getModuleItemById } from '~/store/slices/ModuleItem/action';

const EditModuleItem = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { currentItem, loading, error } = useSelector((state) => state.moduleItem);
    const [moduleItem, setModuleItem] = useState('');

    const moduleItemId = useParams();
    useEffect(() => {
        if (moduleItemId) {
            dispatch(getModuleItemById(moduleItemId));
        }
    }, [dispatch, moduleItemId])

    useEffect(() => {
        if (currentItem) {
            setModuleItem(currentItem.data);
        }
    }, [dispatch, currentItem])

    console.log('ModuleItem:', moduleItem);
    const renderContentComponent = () => {
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
