import { Add, Block, CheckCircle, Delete, Edit, Group, Refresh, Search } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, CircularProgress, IconButton, Tooltip, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { formatDistance } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, getAllAccount, updateAccount, groupAccount } from "~/store/slices/Account/action";
import EditUserModal from "./EditModal";
import CreateUserModal from "./CreateModal";
import GroupUsersModal from "./GroupModal";
import AddToGroupModal from "./AddToGroupModal";
import UserGroups from "./UserGroups";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
function AccountManager() {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [userPicked, setUsersPicked] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openGroupModal, setOpenGroupModal] = useState(false);
    const [openAddToGroupModal, setOpenAddToGroupModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [limit, setLimit] = useState(25);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
      email: "",
      fullname: "",
      username: "",
      role: "",
      status: "",
      isPaid: ""
    });
    const [showFilters, setShowFilters] = useState(false);

    // Redux state
    const pagination = useSelector(state => state.account.pagination);
    const loadingState = useSelector(state => state.account.loading);

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
      <Tooltip title={row.status === 'active' ? 'Block User' : 'Activate User'}>
        <IconButton 
          size="small" 
          color={row.status === 'active' ? 'error' : 'success'}
          onClick={() => handleToggleStatus(row)}
        >
          {row.status === 'active' ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete User">
        <IconButton 
          size="small" 
          color="error"
          onClick={() => handleDeleteUser(row)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const columns = [
    {
      field: 'userInfo',
      headerName: 'User Information',
      flex: 1,
      minWidth: 200,
      renderCell: UserInfoCell,
      valueGetter: (params) => params?.row?.profile.fullname || params?.row?.username,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      renderCell: RoleCell,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: StatusCell,
    },
    {
      field: 'enrolled_courses',
      headerName: 'Enrolled Courses',
      width: 120,
      valueGetter: (params) => params?.row?.enrolled_courses.length,
    },
    {
      field: 'lastLoginAt',
      headerName: 'Last Login',
      width: 130,
      valueGetter: (params) => 
        params?.row.lastLoginAt ? formatDistance(new Date(params?.row.lastLoginAt), new Date(), { addSuffix: true }) : 'Never',
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 130,
      valueGetter: (params) => 
        params?.row.createdAt ? formatDistance(new Date(params?.row.createdAt), new Date(), { addSuffix: true }) : 'Unknown',
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
    setOpenEditModal(true);
    setUsersPicked(user);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const confirmChange = window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'block'} this user?`);
    
    if (confirmChange) {
      setLoading(true);
      try {
        const updateData = {
          userId: user._id,
          status: newStatus,
          role: user.role,
          fullname: user.profile.fullname,
          email: user.email,
          phone: user.profile?.phone || '',
          bio: user.profile?.bio || '',
          username: user.username
        };
        
        const result = await dispatch(updateAccount(updateData));
        if (updateAccount.fulfilled.match(result)) {
          toast.success(`User ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`);
          handleRefresh();
        } else {
          toast.error(`Failed to ${newStatus === 'active' ? 'activate' : 'block'} user: ${result.payload.message}`);
        }
      } catch (error) {
        toast.error(`An error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (confirmDelete) {
      setLoading(true);
      try {
        const result = await dispatch(deleteAccount(user._id));
        if (deleteAccount.fulfilled.match(result)) {
          toast.success('User deleted successfully');
          handleRefresh();
        } else {
          toast.error(`Failed to delete user: ${result.payload.message}`);
        }
      } catch (error) {
        toast.error(`An error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  const handleCreateUser = () => {
    setOpenCreateModal(true);
  };

  const handleAddToGroup = () => {
    if (selectedUsers.length < 1) {
      toast.error("Please select at least 1 user to add to a group");
      return;
    }
    setOpenAddToGroupModal(true);
  };

  const handleAddToGroupClose = () => {
    setOpenAddToGroupModal(false);
    // Wait a bit before refreshing to allow the API to update
    setTimeout(handleRefresh, 500);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1); // DataGrid uses 0-based indexing
  };

  const handlePageSizeChange = (newPageSize) => {
    setLimit(newPageSize);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    handleRefresh();
  };

  const handleClearFilters = () => {
    setFilters({
      email: "",
      fullname: "",
      username: "",
      role: "",
      status: "",
      isPaid: ""
    });
    // Wait for state to update then refresh
    setTimeout(handleRefresh, 0);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchParams = {
          page: page,
          limit: limit,
          filters: {
            ...filters
          }
        };

        const result = await dispatch(getAllAccount(fetchParams));
        if (getAllAccount.fulfilled.match(result)) {
          setUsers(result.payload.data.users);
        } else {
          toast.error(result.payload?.message || 'Failed to fetch users');
        }
      } catch (error) {
        toast.error(`An error occurred: ${error.message}`);
      }
    };
    
    getUsers();
  }, [dispatch, page, limit, refreshTrigger]);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', px: 1, mb: 2 }}>
      <Box sx={{ width: '100%' }}>
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h5" fontWeight="bold">
            Account Management
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Button 
              variant="outlined" 
              startIcon={<Search />} 
              onClick={toggleFilters}
              size="small"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Refresh />} 
              onClick={handleRefresh}
              size="small"
            >
              Refresh
            </Button>
            <Button 
              variant="contained"
              color="secondary" 
              disabled={selectedUsers.length < 1}
              startIcon={<Group />} 
              onClick={handleAddToGroup}
              size="small"
            >
              Add to Group ({selectedUsers.length})
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Add />} 
              onClick={handleCreateUser}
              size="small"
            >
              Create User
            </Button>
          </Box>
        </Box>
        
        {/* Filters */}
        {showFilters && (
          <Paper sx={{ mb: 3, p: 2 }}>
            <form onSubmit={handleFilterSubmit}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullname"
                    value={filters.fullname}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={filters.username}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="instructor">Instructor</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="blocked">Blocked</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Paid</InputLabel>
                    <Select
                      label="Paid"
                      name="isPaid"
                      value={filters.isPaid}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}
        
        {openEditModal && <EditUserModal open={openEditModal} setOpen={setOpenEditModal} userData={userPicked}/>}
        {openCreateModal && <CreateUserModal open={openCreateModal} setOpen={setOpenCreateModal} />}
        {openAddToGroupModal && <AddToGroupModal 
          open={openAddToGroupModal} 
          handleClose={handleAddToGroupClose}
          selectedUsers={selectedUsers}
        />}
        
        {loading || loadingState ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 500, width: '100%', overflow: 'auto' }}>
            <DataGrid
              rows={users || []}
              columns={columns}
              paginationMode="server"
              rowCount={pagination.total}
              pageSizeOptions={[25, 50, 100]}
              paginationModel={{
                pageSize: limit,
                page: page - 1  // DataGrid uses 0-based indexing
              }}
              onPaginationModelChange={(model) => {
                handlePageChange(model.page);
                handlePageSizeChange(model.pageSize);
              }}
              getRowId={(row) => row._id}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectedUsers(newSelectionModel);
              }}
              rowSelectionModel={selectedUsers}
              rowHeight={70}
              loading={loading || loadingState}
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
                '& .MuiDataGrid-main': {
                  overflow: 'hidden',
                },
                width: '100%',
                overflow: 'visible'
              }}
            />
          </Box>
        )}
      </Box>

      {/* User Groups Section */}
      <UserGroups refreshTrigger={refreshTrigger} />
    </Box>
  );
}

export default AccountManager;