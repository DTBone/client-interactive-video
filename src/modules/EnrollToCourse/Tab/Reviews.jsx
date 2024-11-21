import { useEffect, useState } from "react";
import { Avatar, Button, TextField, Box, Rating, Paper, Pagination } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SendSharp, StarOutline } from "@mui/icons-material";
import moment from 'moment';
import {useDispatch} from "react-redux";
import {createReview, getReviews} from "~/store/slices/Review/action.js";

const Reviews = ({ course }) => {
    const dispatch = useDispatch();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ratingStats, setRatingStats] = useState({ ovg: 0, numReviews: 0 });
    const limit = 5;
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const result = await dispatch(getReviews({courseId: course._id, limit, page}));
                console.log(result);
                if(result.payload.success){
                    setReviews(result.payload.data);
                    setTotalPages(Math.ceil(result.payload.count / limit));
                    setRatingStats({
                        ovg: result.payload.ovg,
                        numReviews: result.payload.count
                    });

                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [course._id, page]);

    const handleSubmitReview = async () => {
        if (!comment.trim()) return;

        try {
            const result = await dispatch(createReview({
                courseId: course._id,
                rating,
                comment
            }));

            if(result.payload.success){
                setReviews([result.payload.data, ...reviews]);
                setRatingStats({
                    ovg: ((ratingStats.ovg * ratingStats.numReviews) + rating) / (ratingStats.numReviews + 1),
                    numReviews: ratingStats.numReviews + 1
                });
                setComment('');
                setRating(5);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            {/* Rating Statistics */}
            <Box
                sx={{
                    mb: 4,
                    p: 2,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#CA122C', fontWeight: 'bold' }}>
                        {course.averageRating && course.averageRating.toFixed(1)}
                    </Typography>
                    <Rating
                        value={course.averageRating}
                        readOnly
                        precision={0.1}
                        sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {ratingStats?.numReviews} {ratingStats?.numReviews === 1 ? 'review' : 'reviews'}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Course Reviews
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Share your thoughts about this course with other students
                    </Typography>
                </Box>
            </Box>

            {/* Input Section */}
            <Box sx={{ mb: 3 }}>
                <Box className='flex flex-row items-center gap-2 mb-2 w-1/2'>
                    <Avatar
                        src={user?.profile.picture}
                        alt={user?.profile.fullname}
                        sx={{ width: 40, height: 40 }}
                    />
                    <TextField
                        size='small'
                        variant='outlined'
                        placeholder='Write a review...'
                        value={comment}
                        sx={{ flexGrow: 1 }}
                        onChange={(e) => setComment(e.target.value)}
                        multiline
                        rows={2}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Rating
                            value={rating}
                            onChange={(_, newValue) => setRating(newValue)}
                        />
                        <Button
                            variant='contained'
                            size='small'
                            onClick={handleSubmitReview}
                            sx={{
                                backgroundColor: '#CA122C',
                                '&:hover': {
                                    backgroundColor: '#a50f24',
                                },
                                height: '35px'
                            }}
                        >
                            <SendSharp />
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Reviews List */}
            <Box sx={{ mt: 2 }}>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : reviews.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 4,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1
                    }}>
                        <StarOutline sx={{ fontSize: 48, color: '#CA122C', opacity: 0.5 }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            No reviews yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Be the first to review this course
                        </Typography>
                    </Box>
                ) : (
                    reviews.map((review) => (
                        <Paper
                            key={review._id}
                            elevation={1}
                            sx={{
                                p: 2,
                                mb: 2,
                                backgroundColor: '#f8f9fa'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar
                                    src={review.user?.profile.picture}
                                    alt={review.user?.profile.fullname}
                                    sx={{ width: 32, height: 32, mr: 1 }}
                                />
                                <Box>
                                    <Typography variant="subtitle2">
                                        {review.user.profile.fullname}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {moment(review.createdAt).fromNow()}
                                    </Typography>
                                </Box>
                                <Rating
                                    value={review.rating}
                                    readOnly
                                    size="small"
                                    sx={{ ml: 'auto' }}
                                />
                            </Box>
                            <Typography variant="body2">
                                {review.comment}
                            </Typography>
                        </Paper>
                    ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 3,
                        mb: 2
                    }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                            size="medium"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#CA122C',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#CA122C !important',
                                    color: 'white',
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Reviews;