import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Pie, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  VisibilityOutlined as ViewIcon,
  GetApp as DownloadIcon,
  Close as CloseIcon,
  DateRange as DateRangeIcon,
  AttachMoney as MoneyIcon,
  ThumbUp as SuccessIcon,
  Pending as PendingIcon,
  ThumbDown as FailedIcon,
  CreditCard as PaymentMethodIcon,
  RefreshOutlined as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { api } from '~/Config/api';
import { formatCurrency } from '~/Utils/format.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CHART_COLORS = [
  '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', 
  '#3f51b5', '#e91e63', '#607d8b', '#00bcd4', '#8bc34a'
];

const Payment = () => {
  // State variables
  const [filters, setFilters] = useState({
    fromMonth: 1,
    toMonth: 12,
    year: new Date().getFullYear(),
    userId: '',
    search: '',
    courseId: '',
    paymentStatus: '',
    paymentMethod: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc'
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [period, setPeriod] = useState('monthly');
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);

  // Fetch payments based on filters
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/payments?${queryParams.toString()}`);
      setPayments(response.data.data.payments);
      setTotal(response.data.totalCount);
      setAnalytics(response.data.analytics);
      setFinancialSummary(response.data.financialSummary);
      
      // Transform monthly trend data for chart
      if (response.data.analytics.monthlyTrends) {
        const trendData = response.data.analytics.monthlyTrends.map(item => ({
          name: MONTHS[item._id.month - 1],
          revenue: item.total,
          transactions: item.count
        }));
        setTrendData(trendData);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payment data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics based on period
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await api.get(`/payments/analytics?period=${period}`);
      
      // Process revenue trends for charts
      const trends = response.data.analytics.revenueTrends.map(item => {
        let name;
        if (period === 'monthly') {
          name = MONTHS[item._id.month - 1] + ' ' + item._id.year;
        } else if (period === 'weekly') {
          name = 'Week ' + item._id.week + ', ' + item._id.year;
        } else if (period === 'daily') {
          name = item._id.day + '/' + item._id.month;
        } else {
          name = item._id.year.toString();
        }
        return {
          name,
          revenue: item.revenue,
          transactions: item.count
        };
      });
      
      setTrendData(trends);
      setAnalytics({
        ...analytics,
        ...response.data.analytics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const exportExcel = async () => {
    const response = await api.get('/payments/export', {
        responseType: 'blob'
    });
    const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.xlsx';
    a.click();
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchPayments();
    fetchAnalytics();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchPayments();
    }
  }, [filters.page, filters.limit, filters.sort, filters.order]);

  // Refetch analytics when period changes
  useEffect(() => {
    if (!analyticsLoading) {
      fetchAnalytics();
    }
  }, [period]);

  // Apply filters handler
  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      page: 1 // Reset to first page when applying new filters
    });
    fetchPayments();
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters({
      fromMonth: 1,
      toMonth: 12,
      year: new Date().getFullYear(),
      userId: '',
      search: '',
      courseId: '',
      paymentStatus: '',
      paymentMethod: '',
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'desc'
    });
    fetchPayments();
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setFilters({
      ...filters,
      page: newPage + 1
    });
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setFilters({
      ...filters,
      limit: parseInt(event.target.value, 10),
      page: 1
    });
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get payment status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 'success':
        return <Chip label="Success" color="success" size="small" icon={<SuccessIcon />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<PendingIcon />} />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" icon={<FailedIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Create summary cards
  const SummaryCard = ({ title, value, subvalue, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>{value}</Typography>
            {subvalue && (
              <Typography variant="body2" color="text.secondary">{subvalue}</Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Render the top section with summary cards
  const renderSummary = () => {
    if (!financialSummary) return null;
    
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard 
            title="Total Revenue" 
            value={formatCurrency(financialSummary?.success?.total || 0)}
            subvalue={`${financialSummary?.success?.count || 0} successful transactions`}
            icon={<MoneyIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard 
            title="Successful Payments" 
            value={financialSummary?.success?.count || 0}
            subvalue={`${formatCurrency(financialSummary?.success?.total || 0)}`}
            icon={<SuccessIcon />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard 
            title="Pending Payments" 
            value={financialSummary?.pending?.count || 0}
            subvalue={`${formatCurrency(financialSummary?.pending?.total || 0)}`}
            icon={<PendingIcon />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard 
            title="Failed Payments" 
            value={financialSummary?.failed?.count || 0}
            subvalue={`${formatCurrency(financialSummary?.failed?.total || 0)}`}
            icon={<FailedIcon />}
            color="#f44336"
          />
        </Grid>
      </Grid>
    );
  };

  // Render the filter section
  const renderFilters = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setShowFilters(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Order ID, Payment ID..."
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={filters.paymentStatus}
              label="Payment Status"
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={filters.paymentMethod}
              label="Payment Method"
              onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="crypto">Cryptocurrency</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              {[2020, 2021, 2022, 2023, 2024].map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>From Month</InputLabel>
            <Select
              value={filters.fromMonth}
              label="From Month"
              onChange={(e) => setFilters({ ...filters, fromMonth: e.target.value })}
            >
              {MONTHS.map((month, index) => (
                <MenuItem key={month} value={index + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>To Month</InputLabel>
            <Select
              value={filters.toMonth}
              label="To Month"
              onChange={(e) => setFilters({ ...filters, toMonth: e.target.value })}
            >
              {MONTHS.map((month, index) => (
                <MenuItem key={month} value={index + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sort}
              label="Sort By"
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <MenuItem value="createdAt">Date</MenuItem>
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="paymentStatus">Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.order}
              label="Order"
              onChange={(e) => setFilters({ ...filters, order: e.target.value })}
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button variant="contained" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  // Render the charts section
  const renderCharts = () => {
    if (!analytics || analyticsLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={period}
              label="Time Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="daily">Daily (Last 30 days)</MenuItem>
              <MenuItem value="weekly">Weekly (Last 12 weeks)</MenuItem>
              <MenuItem value="monthly">Monthly (Last 12 months)</MenuItem>
              <MenuItem value="yearly">Yearly (Last 5 years)</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Analytics">
            <IconButton onClick={fetchAnalytics}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {/* Revenue Trends Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Revenue Trends</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="transactions" 
                      name="Transactions" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Payment Method Distribution */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Payment Methods</Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                {analytics.paymentMethodStats && analytics.paymentMethodStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.paymentMethodStats.map(item => ({
                          name: item._id || 'Unknown',
                          value: item.total
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.paymentMethodStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    No payment method data available
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Top Courses by Revenue */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Top Courses by Revenue</Typography>
              <Box sx={{ height: 350 }}>
                {analytics.topCourses && analytics.topCourses.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.topCourses.map(course => ({
                        name: course.course?.title || 'Unknown Course',
                        revenue: course.totalRevenue,
                        enrollments: course.enrollments
                      })).slice(0, 5)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                      <Bar dataKey="enrollments" name="Enrollments" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No course revenue data available
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Top Instructors by Revenue */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Top Instructors by Revenue</Typography>
              <Box sx={{ height: 350 }}>
                {analytics.topInstructors && analytics.topInstructors.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.topInstructors.map(instructor => ({
                        name: instructor.instructor?.fullname || 'Unknown Instructor',
                        revenue: instructor.totalRevenue,
                        courses: instructor.coursesSold
                      })).slice(0, 5)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                      <Bar dataKey="courses" name="Courses Sold" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No instructor revenue data available
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  // Render the payments table
  const renderPaymentsTable = () => (
    <Paper sx={{ width: '100%', mb: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No payment records found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>{payment.orderId || payment._id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={payment.userId?.profile?.picture} sx={{ mr: 1, width: 32, height: 32 }}>
                        {payment.userId?.profile?.fullname?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{payment.userId?.profile?.fullname || 'Unknown User'}</Typography>
                        <Typography variant="caption" color="text.secondary">{payment.userId?.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {payment.courseId?.title || 'Unknown Course'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<PaymentMethodIcon />} 
                      label={payment.paymentMethod || 'Unknown'} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(payment.paymentStatus)}</TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Receipt">
                        <IconButton size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={filters.limit}
        page={filters.page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Payment Management</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />} 
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={exportExcel}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      {/* Summary Section */}
      {renderSummary()}

      {/* Filters Section */}
      {showFilters && renderFilters()}

      {/* Tabs for Analytics and Payments */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Payments" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {/* Content based on selected tab */}
      {tabValue === 0 ? (
        renderPaymentsTable()
      ) : (
        renderCharts()
      )}
    </Box>
  );
};

export default Payment;