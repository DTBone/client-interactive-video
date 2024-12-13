
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '~/index.css';
import success from '../../../../assets/success.gif';
import failed from '../../../../assets/failed.gif';
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import {getAllCourse} from "~/store/slices/Course/action.js";

function PaymentStatus() {

    const location = useLocation();
    const [status, setStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const [courseId, setCourseId] = useState('')
    const [amount, setAmount] = useState('');
    const [transactionNo, setTransactionNo] = useState('');
    const dispatch = useDispatch();
    function addThousandSeparator(number) {
        // Chuyển đổi số thành chuỗi và tách phần nguyên và phần thập phân (nếu có)
        let [integer, decimal] = number.toString().split('.');
        
        // Thêm dấu phẩy phân cách hàng nghìn vào phần nguyên
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
        // Nếu có phần thập phân, ghép lại phần nguyên và phần thập phân
        return decimal ? `${integer}.${decimal}` : integer;
      }
      const navigate = useNavigate();
      const handleClick =async () =>{
        navigate(`/course/${courseId}`)
        //   try{
        //       const result = await dispatch(getAllCourse({limit:100}));
        //       if(result.meta.requestStatus === 'fulfilled'){
        //           const courses = result.payload.data;
        //           const course = courses.find(course => course._id === courseId);
        //           navigate(`/course/${course.courseId}`)
        //       }
              
        //   }
        //   catch(e){
        //       console.log(e);
        //       return;
        //   }
      }
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setStatus(queryParams.get('status'));
    setOrderId(queryParams.get('orderId'));
    setAmount(queryParams.get('amount'));
    setTransactionNo(queryParams.get('transactionNo'));
    setCourseId(queryParams.get('courseId'));
  }, [location]);
    return ( 
        <div className='w-screen h-screen flex items-center justify-center'>
            {status === 'success' ? (
                    <Box sx={{ 
                        width: '50%',
                        height: '70%',
                        minHeight: '300px',
                        bgcolor: 'background.paper', 
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);', 
                        mt: '50px',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '100px',
                         }}>
                    <img src={success} className='w-1/3'/>
                    <Typography color='success' variant="h4">Payment Success</Typography>
                    <Typography sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>Order ID: {orderId}</Typography>
                    <Typography sx={{
                        fontSize: '1.5rem',
                    }}>Amount: {addThousandSeparator(amount)} VND</Typography>
                    <Typography sx={{
                        fontSize: '1.5rem',
                    }}>Transaction No: {transactionNo}</Typography>
                                <Button variant='contained' sx={{ width: '200px', height: '50px', mt: '20px' }} onClick={handleClick}>Back to Course</Button>

                    </Box>
            ) : (
                <Box sx={{ 
                    width: '50%',
                    height: '70%',
                    minHeight: '300px',
                    bgcolor: 'background.paper', 
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);', 
                    mt: '50px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '100px',
                     }}>
                <img src={failed} className='w-1/3'/>
                <Typography color='fail' variant="h4">Payment Failed</Typography>
                <Typography sx={{
                    fontSize: '1.5rem',
                }}>Order ID: {orderId}</Typography>
                <Typography sx={{
                    fontSize: '1.5rem',
                }}>Amount: {addThousandSeparator(amount || 3000)} VND</Typography>
                <Typography sx={{
                    fontSize: '1.5rem',
                }}>Transaction No: {transactionNo}</Typography>
                <Button variant='contained' sx={{ width: '200px', height: '50px', mt: '20px' }} onClick={handleClick}>Back to Course</Button>
                </Box>
            )}
        </div>
     );
}

export default PaymentStatus;