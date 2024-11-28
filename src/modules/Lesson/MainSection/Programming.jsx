import React, { useEffect } from 'react';
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ModuleItem from './../../CourseDetail/MainSection/Modules/ModuleItem';
import { getModuleItemById } from '~/store/slices/ModuleItem/action';

const Programming = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const problemId = "sorting_problem";
    const { itemId } = useParams();
    console.log("itemId", itemId);
    const handleCodeClick = () => {
        const formatUrlSlug = (text) => {
            return text
                .toLowerCase() // Chuyển tất cả thành chữ thường
                .replace(/[^\w\s-]/g, '') // Loại bỏ các ký tự đặc biệt
                .trim() // Loại bỏ khoảng trắng thừa ở đầu và cuối
                .replace(/\s+/g, '-'); // Thay thế khoảng trắng bằng dấu gạch ngang
        };

        const url = `/problems/${formatUrlSlug(currentItem.data.programming._id)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    const { currentItem, loading, error } = useSelector(state => state.moduleItem);
    useEffect(() => {
        const fetchData = async () => { // Sửa cú pháp async function
            try {
                const result = await dispatch(getModuleItemById({ moduleItemId: itemId }));
                if (getModuleItemById.fulfilled.match(result)) {
                    console.log("fetch data successfully", currentItem.data.programming.problemName);
                } else {
                    console.log("error");
                }
            } catch (error) {
                console.error("Fetch data error:", error);
            }
        };

        fetchData();
    }, [dispatch, itemId]); // Thêm itemId vào dependency array


    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Button
                onClick={handleCodeClick}
                variant="contained"
                color="primary"
            >
                Go to Code Compiler
            </Button>
        </div>
    );
};

export default Programming;