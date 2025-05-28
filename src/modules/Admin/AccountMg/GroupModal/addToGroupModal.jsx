import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserGroups, addUserToGroup } from "~/store/slices/Account/action";
import { toast } from "react-toastify";
/* eslint-disable react/prop-types */
function AddToGroupModal({users}) {
    const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const groups = useSelector(state => state.account.groups); 
    const [selectedGroup, setSelectedGroup] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchGroups = async () => {
          setLoading(true);
          try {
            await dispatch(fetchUserGroups());
          } catch (error) {
            toast.error(`Error fetching groups: ${error.message}`);
          } finally {
            setLoading(false);
          }
        };
        
        fetchGroups();
      }, [dispatch]);
    const handleAddUser = async () => {
        setLoading(true);
        try {
            await dispatch(addUserToGroup(selectedGroup._id, selectedUser));
            toast.success("User added to group successfully");
            setOpenAddUserDialog(false);
        } catch (error) {
            console.error("Error adding user to group:", error);
        } finally {
            setLoading(false);
    };

    return ( 
        <Dialog open={openAddUserDialog} onClose={() => setOpenAddUserDialog(false)}>   
            <DialogTitle>Add User to Group</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="user-select-label">Select Group</InputLabel>
                    <Select
                        labelId="user-select-label"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        label="Select Group"
                    >
                        {groups.map((group) => (
                            <MenuItem key={group._id} value={group._id}>
                                {group.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="user-select-label">Select User</InputLabel>
                        <Select
                            labelId="user-select-label"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            label="Select User"
                        >
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.profile?.fullname || user.username}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                    <DialogActions>
                        <Button onClick={() => setOpenAddUserDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddUser} variant="contained" color="primary" disabled={!selectedUser || loading}>
                            Add
                        </Button>
                    </DialogActions>
                </FormControl>
            </DialogContent>
        </Dialog>
     );
}
}


export default AddToGroupModal;