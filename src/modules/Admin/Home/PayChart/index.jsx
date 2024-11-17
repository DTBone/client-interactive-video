import { ArrowForward } from '@mui/icons-material';
import { FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentByFilter } from '~/store/slices/Payment/action';
import { DataGrid } from '@mui/x-data-grid';
import '~/index.css';
import PayDetail from '../PayDetail';

function PayChart() {
    const [payments, setPayments] = useState(useSelector(state => state.payment.payments));
    
    const [courses, setCourses] = useState([]);
    const [courseShow, setCourseShow] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [paymentId, setPaymentId] = useState('');
    const dispatch = useDispatch();
    const month = [
        {
            key: 1,
            value: 'January'
        },
        {
            key: 2,
            value: 'February'
        },
        {
            key: 3,
            value: 'March'
        },
        {
            key: 4,
            value: 'April'
        },
        {
            key: 5,
            value: 'May'
        },
        {
            key: 6,
            value: 'June'
        },
        {
            key: 7,
            value: 'July'
        },
        {
            key: 8,
            value: 'August'
        },
        {
            key: 9,
            value: 'September'
        },
        {
            key: 10,
            value: 'October'
        },
        {
            key: 11,
            value: 'November'
        },
        {
            key: 12,
            value: 'December'
        }

    ]
    // Nhóm thanh toán theo khóa học và đếm số lượng
    const courseCounts = payments ? payments.reduce((acc, payment) => {
        acc[payment.courseId] = (acc[payment.courseId] || 0) + 1;
        return acc;
    }, {}) : {};

    const handleChangeCourseShow = (event) => {
        setCourseShow(event.target.value);
        console.log(event.target.value);
    };

    // Định dạng dữ liệu cho PieChart
    const pieData = payments ? Object.keys(courseCounts).map((courseId, index) => ({
        id: index,
        value: courseCounts[courseId],
        label: `Course ${(courses.find(course => course?._id === courseId))?.title}`, // Hoặc thay `Course` bằng tên khóa học nếu có
    })) : [];
    const handleChange = (event) => {
        setFrom(event.target.value);
    };
    const handleChangeTo = (event) => {
        setTo(event.target.value);
    };
    const today = new Date().getMonth() + 1;

    const [from, setFrom] = useState(month[today-1].key);
    const [to, setTo] = useState(month[today-1].key);

    useEffect(() => {
        const fetchPayments = async () => {
            // Đợi dispatch hoàn thành
            const result = await dispatch(getPaymentByFilter({from: from, to: to, year: new Date().getFullYear()}));
            if (getPaymentByFilter.fulfilled.match(result)) {
                setPayments(result.payload.data.payments);
                setCourses(result.payload.data.courses);
            } else {
                console.error("Failed to fetch payments:", result.error.message);
            }
        };
    
        if (!payments || payments.length === 0) {
            fetchPayments();
        }
    }, [from, to, dispatch, payments]);
    const columns = [
        { field: '_id', headerName: 'ID', width: 200 },
        { field: 'userId', headerName: 'User ID', width: 150 },
        { field: 'course', headerName: 'Course', width: 150 },
        { field: 'amount', headerName: 'Amount', width: 130 },
        { field: 'currency', headerName: 'Currency', width: 100 },
        { field: 'paymentMethod', headerName: 'Payment Method', width: 150 },
        { field: 'paymentStatus', headerName: 'Payment Status', width: 150 },
        { field: 'paymentId', headerName: 'Payment ID', width: 150 },
        { field: 'createdAt', headerName: 'Created At', width: 200, type: 'dateTime' },
      ];
    
    const rows = payments ? payments.map((payment) => {
        if (courseShow == 0 || courseShow === payment.courseId)
            return {
                id: payment._id,
                _id: payment._id,
                userId: payment.userId,
                course: (courses.find(course => course?._id === payment.courseId))?.title,
                amount: payment.amount,
                currency: payment.currency,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                paymentId: payment.paymentId,
                createdAt: new Date(payment.createdAt)
            }
    }) : [];

    const paginationModel = { page: 0, pageSize: 5 };

    const handleClickPayment = (params) => {
        setOpenModal(true);
        setPaymentId(params.row.id);
    }

    return ( 
        <div className='w-full bg-red-100 p-5 rounded-lg'>
            <div className='flex items-center'>
            <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <InputLabel id="demo-select-small-label">From (Month)</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={from}
                    label="From (Month)"
                    onChange={handleChange}
                >
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                    {month.map((item, index) => (
                        <MenuItem key={index} value={item.key}>{item.value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ArrowForward />
                <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <InputLabel id="demo-select-small-label">To (Month)</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={to}
                    label="To (Month)"
                    onChange={handleChangeTo}
                >
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                    {month.map((item, index) => (
                        <MenuItem key={index} value={item.key}>{item.value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            </div>
            <div className='flex flex-col justify-center'>
            <div className='w-2/3 h-96'>
                <PieChart
                    series={[
                        {
                            data: pieData ? pieData : [],
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            arcLabel: (item) => `${item.value / payments.length * 100}%`,
                        },
                    ]}
                    height={300}
                />
            </div>
            <div className='w-full h-96'>
            <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
                <InputLabel id="demo-select-small-label">Course</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={courseShow}
                    label="Course"
                    onChange={handleChangeCourseShow}
                    defaultValue='0'
                >
                    <MenuItem value='0'>
                    <em>All</em>
                    </MenuItem>
                    {Object.keys(courseCounts).map((item, index) => (
                        <MenuItem key={index} value={item}>{(courses.find(course => course?._id === item))?.title || 'Unknow'}</MenuItem>
                    ))}
                </Select>
            </FormControl>
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows ? rows.filter(row => row) : []}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        sx={{ border: 0 }}
                        onCellDoubleClick={handleClickPayment}
                    />
                </Paper>
            </div>
                </div>
                {openModal && <PayDetail open={openModal} setOpen={setOpenModal} paymentId={paymentId} />}
        </div>
     );
}

export default PayChart;