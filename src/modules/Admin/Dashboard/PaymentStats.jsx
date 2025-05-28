import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { 
  Payment as PaymentIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ShowChart as ShowChartIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { getPaymentByFilter } from '~/store/slices/Payment/action';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

const PaymentStats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [fromMonth, setFromMonth] = useState(1);
  const [toMonth, setToMonth] = useState(12);
  const [year, setYear] = useState(currentYear - 1);

  // Month data for dropdown
  const months = [
    { key: 1, value: 'January' },
    { key: 2, value: 'February' },
    { key: 3, value: 'March' },
    { key: 4, value: 'April' },
    { key: 5, value: 'May' },
    { key: 6, value: 'June' },
    { key: 7, value: 'July' },
    { key: 8, value: 'August' },
    { key: 9, value: 'September' },
    { key: 10, value: 'October' },
    { key: 11, value: 'November' },
    { key: 12, value: 'December' }
  ];

  // Year data for dropdown (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const result = await dispatch(getPaymentByFilter({
          from: fromMonth,
          to: toMonth,
          year: year
        }));

        if (getPaymentByFilter.fulfilled.match(result)) {
          setPayments(result.payload.data.payments);
          setCourses(result.payload.data.courses);
        } else {
          console.error("Failed to fetch payments");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [dispatch, fromMonth, toMonth, year]);

  // Calculate payment stats
  const totalRevenue = payments.reduce((sum, payment) => {
    // Only count successful payments
    if (payment.paymentStatus === 'success') {
      return sum + (payment.amount || 0);
    }
    return sum;
  }, 0);

  // Format as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate by payment method
  const paymentMethodCounts = payments.reduce((acc, payment) => {
    const method = payment.paymentMethod || 'Other';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the payment method pie chart
  const pieChartData = Object.keys(paymentMethodCounts).map((method, index) => ({
    id: index,
    value: paymentMethodCounts[method],
    label: method
  }));

  // Get recent successful payments
  const recentPayments = [...payments]
    .filter(payment => payment.paymentStatus === 'success')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Prepare data for monthly revenue chart
  const monthlyRevenue = Array(12).fill(0);
  
  payments.forEach(payment => {
    if (payment.paymentStatus === 'success') {
      const paymentDate = new Date(payment.createdAt);
      // Only count payments from selected year
      if (paymentDate.getFullYear() === year) {
        const month = paymentDate.getMonth();
        monthlyRevenue[month] += payment.amount || 0;
      }
    }
  });

  return (
    <Card sx={{ mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <PaymentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Financial Overview
          </Typography>
        </Box>

        {/* Filter Controls */}
        <Box display="flex" gap={2} mb={3}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>From Month</InputLabel>
            <Select
              value={fromMonth}
              label="From Month"
              onChange={(e) => setFromMonth(e.target.value)}
            >
              {months.map((month) => (
                <MenuItem key={month.key} value={month.key}>
                  {month.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>To Month</InputLabel>
            <Select
              value={toMonth}
              label="To Month"
              onChange={(e) => setToMonth(e.target.value)}
            >
              {months.map((month) => (
                <MenuItem key={month.key} value={month.key}>
                  {month.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {/* Total Revenue Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {formatCurrency(totalRevenue)}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" alignItems="center">
                      <ArrowUpwardIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main" ml={0.5}>
                        +12% from previous period
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Transactions Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Transactions
                    </Typography>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {payments.length}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" color="textSecondary">
                        {payments.filter(p => p.paymentStatus === 'success').length} successful
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Average Transaction Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Avg. Transaction
                    </Typography>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {formatCurrency(totalRevenue / (payments.filter(p => p.paymentStatus === 'success').length || 1))}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" alignItems="center">
                      {totalRevenue > 5000 ? (
                        <>
                          <ArrowUpwardIcon color="success" fontSize="small" />
                          <Typography variant="body2" color="success.main" ml={0.5}>
                            Good performance
                          </Typography>
                        </>
                      ) : (
                        <>
                          <ArrowDownwardIcon color="error" fontSize="small" />
                          <Typography variant="body2" color="error.main" ml={0.5}>
                            Below target
                          </Typography>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Success Rate Card */}
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: '#f5f5f5', height: '100%' }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                      Success Rate
                    </Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {payments.length ? Math.round((payments.filter(p => p.paymentStatus === 'success').length / payments.length) * 100) : 0}%
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Button 
                      size="small" 
                      color="primary" 
                      sx={{ mt: 0.5 }}
                      onClick={() => navigate('/admin/payments')}
                      endIcon={<ArrowForwardIcon />}
                    >
                      View All Payments
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} mt={1}>
              {/* Payment Methods Pie Chart */}
              <Grid item xs={12} md={6}>
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Payment Methods
                  </Typography>
                  <Card elevation={0} sx={{ bgcolor: '#f5f5f5', p: 2, height: 300 }}>
                    {pieChartData.length > 0 ? (
                      <PieChart
                        series={[
                          {
                            data: pieChartData,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            arcLabel: (item) => `${Math.round((item.value / payments.length) * 100)}%`,
                          },
                        ]}
                        height={250}
                        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        legend={{ hidden: true }}
                      />
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography color="textSecondary">No payment data available</Typography>
                      </Box>
                    )}
                  </Card>
                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                    {Object.keys(paymentMethodCounts).map((method, index) => (
                      <Chip 
                        key={method}
                        label={`${method}: ${paymentMethodCounts[method]}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Monthly Revenue Chart */}
              <Grid item xs={12} md={6}>
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom display="flex" alignItems="center">
                    <ShowChartIcon fontSize="small" sx={{ mr: 1 }} />
                    Monthly Revenue ({year})
                  </Typography>
                  <Card elevation={0} sx={{ bgcolor: '#f5f5f5', p: 2, height: 300 }}>
                    <BarChart
                      xAxis={[{ 
                        data: months.map(m => m.value.substring(0, 3)),
                        scaleType: 'band',
                      }]}
                      series={[{ 
                        data: monthlyRevenue,
                        color: '#2196f3',
                      }]}
                      height={250}
                      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    />
                  </Card>
                </Box>
              </Grid>

              {/* Recent Transactions */}
              <Grid item xs={12}>
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Recent Transactions
                  </Typography>
                  <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    {recentPayments.length > 0 ? (
                      recentPayments.map((payment) => {
                        const course = courses.find(c => c?._id === payment.courseId);
                        return (
                          <ListItem key={payment._id} alignItems="flex-start" sx={{ py: 1 }}>
                            <Avatar 
                              sx={{ mr: 2, bgcolor: 'primary.main' }}
                            >
                              <PaymentIcon />
                            </Avatar>
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight="medium">
                                  {formatCurrency(payment.amount)} - {course?.title || 'Unknown Course'}
                                </Typography>
                              }
                              secondary={
                                <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    {payment.paymentMethod} • {new Date(payment.createdAt).toLocaleDateString()}
                                  </Typography>
                                  <Chip 
                                    size="small" 
                                    label={payment.paymentStatus} 
                                    color={payment.paymentStatus === 'success' ? 'success' : 'warning'}
                                  />
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <ListItemText primary="No recent transactions" />
                      </ListItem>
                    )}
                    <Divider />
                    <ListItem>
                      <Button 
                        fullWidth 
                        size="small" 
                        onClick={() => navigate('/admin/payments')}
                        endIcon={<ArrowForwardIcon />}
                      >
                        View All Transactions
                      </Button>
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStats; 