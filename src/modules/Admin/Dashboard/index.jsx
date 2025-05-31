import UserStats from './UserStats';
import CourseStats from './CourseStats';
import PaymentStats from './PaymentStats';
import { Box } from '@mui/material';

const AdminDashboard = () => {

  return (
    
        <Box sx={{ mt: 2 }}>
          <UserStats />
          <CourseStats />
          <PaymentStats />
        </Box>
  );
};

export default AdminDashboard; 