import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MemoryIcon from '@mui/icons-material/Memory';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { styled } from '@mui/material/styles';
import { useTab } from './Context/TabContext';
import { useDispatch, useSelector } from 'react-redux';
import { getSubmission } from '~/store/slices/Compile/action';
import { useParams } from 'react-router-dom';

const SubmissionTab = () => {
    const { setOpenDetailSubmission, setSubmissionStatus, setSubmissionData } = useTab();
    const { submissions, loading, error, submission } = useSelector((state) => state.compile);
    const { problemId } = useParams();

    const dispatch = useDispatch();
    const handleClickRow = (submission, status) => {
        console.log('row clicked', submission);
        setOpenDetailSubmission(true);
        setSubmissionStatus(status);
        setSubmissionData(submission);
    }
    const [submissionList, setSubmissionList] = useState([]);
    const [sortDirection, setSortDirection] = useState('desc');
    const [sortedSubmissions, setSortedSubmissions] = useState([]);
    useEffect(() => {
        try {
            dispatch(getSubmission({ problemId }))
            console.log('submissions: ', submissions)
            setSubmissionList(submissions.submissions)
        } catch (e) {
            console.log('error: ', e)
        }
    }, [dispatch, submission]);
    useEffect(() => {
        const processSubmissions = () => {
            // Đảm bảo submissionList luôn là một mảng
            const submissionArray = Array.isArray(submissionList)
                ? submissionList
                : (submissionList ? [submissionList] : []);

            // Sắp xếp submissions với kiểm tra an toàn hơn
            const sorted = [...submissionArray].sort((a, b) => {
                // Sử dụng optional chaining và fallback date
                const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);

                return sortDirection === 'desc'
                    ? dateB.getTime() - dateA.getTime()  // Sắp xếp giảm dần
                    : dateA.getTime() - dateB.getTime(); // Sắp xếp tăng dần
            });

            // Cập nhật state với mảng đã sắp xếp
            setSortedSubmissions(sorted);
        };

        // Kiểm tra xem submissionList có dữ liệu trước khi xử lý
        if (submissionList && submissionList.length > 0) {
            processSubmissions();
        }
    }, [submissionList, sortDirection]);

    // Hàm để xử lý sự kiện click vào tiêu đề
    const handleSort = () => {
        setSortDirection(prevDirection => (prevDirection === 'desc' ? 'asc' : 'desc'));
    };

    const EffectArrowBackIcon = styled(ArrowBackIosNewIcon)(({ rotate }) => ({
        transform: `rotate(${rotate})`,
        transition: 'transform 0.3s ease',

    }));
    // xử lý màu xen kẽ cho các row
    const StyledTableRow = styled(TableRow)(({ theme, index }) => ({

        '&:nth-of-type(odd)': {
            backgroundColor: '#f7f7f8',
            '& > *': {
                color: theme.palette.getContrastText('#f7f7f8'),
            },
        },
        '&:nth-of-type(even)': {
            backgroundColor: 'transparent',
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            cursor: 'pointer',
        },
    }));

    return (
        <div>
            <TableContainer
                style={{
                    maxHeight: '85vh',
                    maxWidth: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead classname="mb-4">
                        <TableRow className="bg-transparent">
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    width: '40%'
                                }}
                                onClick={handleSort}
                                style={{ cursor: 'pointer' }}>
                                <div className="flex flex-row justify-start items-center gap-1">
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                        }}>Status</Typography>
                                    <EffectArrowBackIcon rotate={sortDirection === "desc" ? '-90deg' : '90deg'} />

                                </div>

                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: '20%' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>Language</Typography>
                            </TableCell>
                            {/* <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: '20%' }}><Typography
                                sx={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                }}>Runtime</Typography></TableCell> */}
                            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: '20%' }}><Typography
                                sx={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                }}>Memory</Typography></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedSubmissions.map((submission, index) => (
                            <StyledTableRow key={index} onClick={() => handleClickRow(submission, submission.status)}>
                                <TableCell sx={{ width: '40%', whiteSpace: 'nowrap' }} >
                                    <div className="flex flex-col justify-center items-start" >
                                        <Typography
                                            fontSize="1.2rem"
                                            fontWeight="bold"
                                            sx={{
                                                color: submission.status.toLowerCase() === "accepted" ? "#3fb55d" : "#ef4743",
                                                textTransform: "capitalize",
                                            }}

                                        >
                                            {submission.status}
                                        </Typography>
                                        <Typography
                                            fontSize="0.8rem"
                                        >

                                            {/* {new Date(submission.createdAt).toUTCString()} */}
                                            {new Date(submission.createdAt).toLocaleString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}

                                        </Typography>

                                    </div>

                                </TableCell>
                                <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', textTransform: "capitalize", }}>
                                    {submission.language}
                                </TableCell>
                                {/* <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', }}>
                                    <div className="flex flex-row justify-start items-center gap-1">
                                        <AccessTimeIcon />
                                        <div>
                                            {submission.runtime === "false" ? "N/A" : `${submission.runtime} ms`}
                                        </div>
                                    </div>
                                </TableCell> */}
                                <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', }}>
                                    <div className="flex flex-row justify-start items-center gap-1">
                                        <MemoryIcon />
                                        <div>
                                            {submission.memory === "false" ? "N/A" : `${submission.memory} `}
                                        </div>
                                    </div>
                                </TableCell>

                            </StyledTableRow>
                        ))}

                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    )
}

export default SubmissionTab
