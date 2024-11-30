// import React, { useEffect } from 'react';
// import { Button } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import ModuleItem from './../../CourseDetail/MainSection/Modules/ModuleItem';
// import { getModuleItemById } from '~/store/slices/ModuleItem/action';

// const Programming = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const problemId = "sorting_problem";
//     const { itemId } = useParams();
//     console.log("itemId", itemId);
//     const handleCodeClick = () => {
//         const formatUrlSlug = (text) => {
//             return text
//                 .toLowerCase() // Chuyển tất cả thành chữ thường
//                 .replace(/[^\w\s-]/g, '') // Loại bỏ các ký tự đặc biệt
//                 .trim() // Loại bỏ khoảng trắng thừa ở đầu và cuối
//                 .replace(/\s+/g, '-'); // Thay thế khoảng trắng bằng dấu gạch ngang
//         };

//         const url = `/problems/${formatUrlSlug(currentItem.data.programming._id)}`;
//         window.open(url, '_blank', 'noopener,noreferrer');
//     };
//     const { currentItem, loading, error } = useSelector(state => state.moduleItem);
//     useEffect(() => {
//         const fetchData = async () => { // Sửa cú pháp async function
//             try {
//                 const result = await dispatch(getModuleItemById({ moduleItemId: itemId }));
//                 if (getModuleItemById.fulfilled.match(result)) {
//                     console.log("fetch data successfully", currentItem.data.programming.problemName, currentItem.data);
//                 } else {
//                     console.log("error");
//                 }
//             } catch (error) {
//                 console.error("Fetch data error:", error);
//             }
//         };

//         fetchData();
//     }, [dispatch, itemId]); // Thêm itemId vào dependency array


//     if (loading) {
//         return <div>Loading...</div>;
//     }
//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div>
//             <div>

//             </div>
//             <Button
//                 onClick={handleCodeClick}
//                 variant="contained"
//                 color="primary"
//             >
//                 Go to Code Compiler
//             </Button>
//         </div>
//     );
// };

// export default Programming;

import React, { useEffect } from 'react';
import { Button, Typography, Card, CardContent, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getModuleItemById } from '~/store/slices/ModuleItem/action';

const Programming = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { itemId } = useParams();

    const { currentItem, loading, error } = useSelector(state => state.moduleItem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getModuleItemById({ moduleItemId: itemId }));
            } catch (error) {
                console.error("Fetch data error:", error);
            }
        };

        fetchData();
    }, [dispatch, itemId]);

    const handleCodeClick = () => {
        const formatUrlSlug = (text) => {
            return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        };

        if (currentItem?.data?.programming?._id) {
            const url = `/problems/${formatUrlSlug(currentItem.data.programming._id)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" color="error">Error: {error}</Typography>;
    }

    const programmingItem = currentItem?.data;
    const programmingDetails = programmingItem?.programming;

    return (
        <div>
            {programmingItem && (
                <Card sx={{ margin: 'auto', mt: 3 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {programmingItem.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {programmingItem.description}
                        </Typography>

                        {programmingDetails && (
                            <>
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    Problem Details
                                </Typography>
                                <Typography variant="body1">
                                    Problem Name: {programmingDetails.problemName}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Difficulty:
                                    <Chip
                                        label={programmingDetails.difficulty}
                                        color={
                                            programmingDetails.difficulty === 'Easy' ? 'success' :
                                                programmingDetails.difficulty === 'Medium' ? 'warning' :
                                                    'error'
                                        }
                                        size="small"
                                        sx={{ ml: 1 }}
                                    />
                                </Typography>

                                <div dangerouslySetInnerHTML={{ __html: programmingDetails.content }}
                                    style={{ marginTop: 16, border: '1px solid #e0e0e0', padding: 16, borderRadius: 4 }}
                                />
                            </>
                        )}

                        <Button
                            onClick={handleCodeClick}
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Go to Code Compiler
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Programming;