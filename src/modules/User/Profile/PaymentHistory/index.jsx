import React, { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getPaymentByFilter } from '~/store/slices/Payment/action';
const transactionsExam = [{
    _id: "672cb59b5471e95c2a43e9b5",
    userId: "672c8f0cae90080c02a2285e",
    courseId: "672cac4c0d0beb6f9cfa19f9",
    amount: 20000,
    currency: "vnd",
    paymentMethod: "vnpay",
    paymentStatus: "pending",
    paymentId: "1730983323062",
    createdAt: "2024-11-07T12:42:03.156Z"
  }];

const TransactionHistory = ({userId}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactions, setTransactions] = useState(transactionsExam);
  const dispatch = useDispatch();
  const fetchTransactions = async () => {
    // Call API to get transactions
    const params = {
        userId,
        search,
    }
    const rep = await dispatch(getPaymentByFilter(params));
    console.log(rep);
    if (getPaymentByFilter.fulfilled.match(rep)) {
        setTransactions(rep.payload.data.payments);
    }
    };

    useEffect(() => {
        fetchTransactions();
    }, [userId]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning',
      completed: 'success',
      failed: 'error',
      refunded: 'info'
    };
    return statusColors[status] || 'default';
  };

  const formatCurrency = (amount, currency) => {
    if (currency.toLowerCase() === 'vnd') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    }
    return `${amount} ${currency.toUpperCase()}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Transaction History
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search transactions..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Paper elevation={1}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction._id} hover>
                    <TableCell>{transaction.paymentId}</TableCell>
                    <TableCell>
                      {format(new Date(transaction.createdAt), 'dd MMM yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.paymentMethod.toUpperCase()}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.paymentStatus.charAt(0).toUpperCase() + 
                              transaction.paymentStatus.slice(1)}
                        size="small"
                        color={getStatusColor(transaction.paymentStatus)}
                      />
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default TransactionHistory;