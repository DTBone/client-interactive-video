import { Button, Card, CardContent, CardMedia, Divider, MenuItem, TextField, Typography } from '@mui/material';
import '~/index.css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import paymentService from '~/services/api/paymentService';
function Payment() {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();
    const course = location.state?.course;

    var userId = user ? user._id : null;
    if (!userId) {
        userId = window.location.pathname.split('/').at(-1);
    }
    const [price, setPrice] = useState(course?.price);
    const convertCurrency = (price, currency) => {
        if (currency === 'USD') { // Làm tròn 2 chữ số thập phân
            return Math.round(price / 23000 * 100) / 100;
        } else if (currency === 'EUR') {
            return Math.round(price / 27000 * 100) / 100;
        } else {
            return price;
        }
    }
    function addThousandSeparator(number) {
        // Chuyển đổi số thành chuỗi và tách phần nguyên và phần thập phân (nếu có)
        let [integer, decimal] = number.toString().split('.');
        
        // Thêm dấu phẩy phân cách hàng nghìn vào phần nguyên
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
        // Nếu có phần thập phân, ghép lại phần nguyên và phần thập phân
        return decimal ? `${integer}.${decimal}` : integer;
      }
    const currency = [
        {
            value: 'USD',
            label: '$',
        },
        {
            value: 'VND',
            label: '₫',
        },
        {
            value: 'EUR',
            label: '€',
        },
    ]
    const [currencyValue, setCurrencyValue] = useState('VND');
    const handleChangeCur = (event) => {
        setCurrencyValue(event.target.value);
        setPrice(convertCurrency(course?.price, event.target.value));
    };
    const paymentMethod = [
        {
            value: 'VNPAY',
            label: 'VNPAY',
            image: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg'
        },
        {
            value: 'ZaloPay',
            label: 'ZaloPay',
            image: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png'
        }
        
    ]
    const [paymentMethodValue, setPaymentMethodValue] = useState('VNPAY');
    const handleChangeMethod = (event) => {
        setPaymentMethodValue(event.target.value);
    }
    const handlePayment = async () => {
        // Gọi API để thanh toán
        try {
            const response = await paymentService.createPayment(course?.price, course?.courseId);
            window.open(response.data, '_blank');
        }
        catch (error) {
            console.error("Error creating payment", error);
            throw error;
        }
    }
    return ( 
        <div className="w-full flex flex-col items-center">
                <h1 className="text-3xl font-bold">Payment</h1>
            <div className="w-full h-20 gap-5 flex justify-center items-center">
                {/* infoPayment */}
                <div className='flex flex-col gap-5 w-1/3'>
                        <Typography
                            variant='h5'
                            className='text-start font-bold'
                            sx={{ fontWeight: 500, marginTop: "16px" }}
                            noWrap={false}>Payment Information
                        </Typography>
                        <TextField
                            id="outlined-basic"
                            label="Name"
                            variant="outlined"
                            className='w-full'
                            value={user.profile?.fullname}
                            aria-readonly
                        />
                        <TextField
                            id="outlined-basic"
                            label="Your Email"
                            variant="outlined"
                            className='w-full'
                            value={user?.email}
                            aria-readonly
                            />
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Select"
                            defaultValue="VND"
                            helperText="Please select your currency"
                            value={currencyValue}
                            onChange={handleChangeCur}
                            >
                            {currency.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label + ' ' + option.value}
                                </MenuItem>
                            ))}
                            </TextField>
                            <Divider />
                            <Typography
                            variant='h5'
                            className='text-start font-bold'
                            sx={{ fontWeight: 500, marginTop: "16px" }}
                            noWrap={false}>Payment Method
                        </Typography>
                        <TextField
                            id="outlined-select-payment"
                            select
                            label="Select"
                            defaultValue="VNPAY"
                            helperText="Please select your payment method"
                            value={paymentMethodValue}
                            onChange={handleChangeMethod}
                            >
                            {paymentMethod.map((option) => (
                                <MenuItem className='flex flex-row' key={option.value} value={option.value}>
                                    <div className='flex flex-row items-center gap-2'>
                                        <img src={option.image} alt={option.label} style={
                                            {
                                                width: '40px',
                                                height: '40px',
                                            }
                                        }/>
                                        <Typography>{option.label}</Typography>
                                    </div>
                                </MenuItem>
                            ))}
                            </TextField>


                </div>
                <Divider orientation="vertical" flexItem />
                {/* totalPayment */}
                <div className='w-1/3'>
                    <Typography
                        variant='h5'
                        className='text-start font-bold'
                        sx={{ fontWeight: 500, marginTop: "16px" }}
                        noWrap={false}>Course Information
                    </Typography>
                    <Card sx={{ maxWidth: 600, minHeight: 350 }}>
                    <CardMedia
                        sx={{ height: 300 }}
                        image={course?.photo}
                        title="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {course?.title}
                        </Typography>
                    </CardContent>
                    </Card>
                    <Typography
                        variant='h5'
                        className='text-start font-bold'
                        sx={{ fontWeight: 500, marginTop: "16px" }}
                        noWrap={false}>Total cost: {addThousandSeparator(price)} {currencyValue}
                    </Typography>
                    <Divider />
                    <Button onClick={handlePayment} variant='contained' sx={{ width: "18rem", height: "4rem", background: "#0048b0", mt:2 }}>
                        Pay
                    </Button>
                </div>
            </div>
        </div>
     );
}

export default Payment;