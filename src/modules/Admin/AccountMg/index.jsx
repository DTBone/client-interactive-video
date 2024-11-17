import { Block, CheckCircle, Edit } from "@mui/icons-material";
import { Avatar, Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { formatDistance } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { getAllAccount } from "~/store/slices/Account/action";
import EditUserModal from "./EditModal";

/* eslint-disable react/prop-types */
function AccountManager() {
    const userId = JSON.parse(localStorage.getItem('user'))?._id; // adminId
    const [pageSize, setPageSize] = useState(7);
    const dispatch = useDispatch();
    const [users, setUsers] = useState(useSelector(state => state.account.accounts));
    const [userPicked, setUsersPicked] = useState(null)
    const [openModal, setOpenModal] = useState(false);

  // Custom column renderer for Role
  const RoleCell = ({ value }) => {
    const getColor = (role) => {
      switch(role) {
        case 'admin':
          return 'error';
        case 'instructor':
          return 'warning';
        default:
          return 'info';
      }
    };

    return (
      <Chip 
        label={value.toUpperCase()} 
        color={getColor(value || 'student')}
        size="small"
      />
    );
  };

  // Custom column renderer for Status
  const StatusCell = ({ value }) => (
    <Chip
      label={value.toUpperCase()}
      color={value === 'active' ? 'success' : 'error'}
      size="small"
    />
  );

  // Custom column renderer for User Info
  const UserInfoCell = ({ row }) => (
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        src={row.profile.picture} 
        alt={row.profile.fullname}
      >
        {row.profile.fullname?.charAt(0)}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight="bold">
          {row.profile.fullname || row.username}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.email}
        </Typography>
      </Box>
    </Box>
  );

  // Custom column renderer for Actions
  const ActionsCell = ({ row }) => (
    <Box>
      <Tooltip title="Edit User">
        <IconButton size="small" onClick={() => handleEdit(row)}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={row.status === 'active' ? 'Block User' : 'Unblock User'}>
        <IconButton 
          size="small" 
          color={row.status === 'active' ? 'error' : 'success'}
          onClick={() => handleToggleStatus(row)}
        >
          {row.status === 'active' ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );

  const columns = [
    {
      field: 'userInfo',
      headerName: 'User Information',
      width: 300,
      renderCell: UserInfoCell,
      valueGetter: (params) => params?.row?.profile.fullname || params?.row?.username,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: RoleCell,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: StatusCell,
    },
    {
      field: 'enrolled_courses',
      headerName: 'Enrolled Courses',
      width: 150,
      valueGetter: (params) => params?.row?.enrolled_courses.length,
    },
    {
      field: 'lastLoginAt',
      headerName: 'Last Login',
      width: 150,
      valueGetter: (params) => 
        formatDistance(params ? new Date(params) : new Date(), new Date(), { addSuffix: true }),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      valueGetter: (params) => 
        formatDistance(params ? new Date(params) : new Date(), new Date(), { addSuffix: true }),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: ActionsCell,
      sortable: false,
    },
  ];
  // Handler functions
  const handleEdit = (user) => {
    setOpenModal(true);
    setUsersPicked(user)
  };

  const handleToggleStatus = (user) => {
    console.log('Toggle status for user:', user);
    // Implement status toggle functionality
  };

  useEffect(() => {
    const getUsers = async () =>{
        const result = await dispatch(getAllAccount(userId));
        if (getAllAccount.fulfilled.match(result)) {
            setUsers(result.payload.data)
        }
        else
        	console.log(result.payload.message)
    }
    if(!users || users.length === 0) {
        getUsers();
    }
    }, [userId, dispatch, openModal, users])

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Account Management
        </Typography>
      </Box>
      {openModal && <EditUserModal open={openModal} setOpen={setOpenModal} userData={userPicked}/>}
      <DataGrid
        rows={users ? users : []}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        onPageSizeChange={setPageSize}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        rowHeight={70} // Adjust the row height as needed
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#fff',
          },
        }}
      />
    </Box>
  );
}

export default AccountManager;