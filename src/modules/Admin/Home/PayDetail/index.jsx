/* eslint-disable react/prop-types */
import { Payment } from "@mui/icons-material";
import { Avatar, Chip, Divider, Modal, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPaymentById } from "~/store/slices/Payment/action";
import { formatDistance } from 'date-fns';

function PayDetail({paymentId, open, setOpen}) {

    const [payment, setPayment] = useState({});
    const dispatch = useDispatch();
    useEffect(() => {
        const getPayment = async () => {
            // Call API to get payment detail by paymentId
            const result = await dispatch(getPaymentById(paymentId));
            console.log(result);    
            if(getPaymentById.fulfilled.match(result)) {
                setPayment(result.payload.data);
            }
        }
        getPayment();
    }, [paymentId, dispatch])
    const getStatusColor = (status) => {
        switch(status) {
            case 'success':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };
    // Format amount
    const formattedAmount = payment.amount ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: payment.currency?.toUpperCase() || 'VND'
    }).format(payment.amount) : '';

    // Format date
    const formattedDate = payment.createdAt ? 
        formatDistance(new Date(payment.createdAt), new Date(), { addSuffix: true }) : '';

    return ( 
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: {xs: '90%', sm: 600},
                maxHeight: '90vh',
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
            }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Payment color="primary" fontSize="large" />
                        <Typography variant="h6">Payment Details</Typography>
                    </Box>
                    {payment.paymentStatus && (
                        <Chip 
                            label={payment.paymentStatus.toUpperCase()}
                            color={getStatusColor(payment.paymentStatus)}
                            variant="outlined"
                        />
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Content */}
                <Grid container spacing={3}>
                    {/* User Info */}
                    {payment.userId && (
                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar 
                                    src={payment.userId.profile?.picture} 
                                    alt={payment.userId.profile?.fullname}
                                    sx={{ width: 56, height: 56 }}
                                />
                                <Box>
                                    <Typography variant="h6">
                                        {payment.userId.profile?.fullname}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {payment.userId.profile?.phone}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Course Info */}
                    {payment.courseId && (
                        <Grid item xs={12}>
                            <Typography color="text.secondary" fontWeight={500}>
                                Course
                            </Typography>
                            <Typography variant="subtitle1">
                                {payment.courseId.title}
                            </Typography>
                        </Grid>
                    )}

                    {/* Payment Info */}
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary" fontWeight={500}>
                            Amount
                        </Typography>
                        <Typography variant="h6" color="primary">
                            {formattedAmount}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary" fontWeight={500}>
                            Payment Method
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
                            {payment.paymentMethod}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary" fontWeight={500}>
                            Payment ID
                        </Typography>
                        <Typography variant="subtitle1">
                            {payment.paymentId}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary" fontWeight={500}>
                            Created
                        </Typography>
                        <Typography variant="subtitle1">
                            {formattedDate}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
     );
}

export default PayDetail;