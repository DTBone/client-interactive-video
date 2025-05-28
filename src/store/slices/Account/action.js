import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';
// Tạo async thunks
export const getAllAccount = createAsyncThunk(
    'accounts/getAllAccount',
    async ({ page = 1, limit = 25, filters = {} }, { rejectWithValue }) => {
        try {
            // Build query params
            const queryParams = new URLSearchParams();
            queryParams.append('page', page);
            queryParams.append('limit', limit);
            
            // Add any filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            
            const data = await api.get(`/users?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            
            return data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || 'Failed to get accounts');
        }
    }
);
//Update account
export const updateAccount = createAsyncThunk(
    'accounts/updateAccount',
    async (data, { rejectWithValue }) => {
        const adminId = JSON.parse(localStorage.getItem('user'))._id
        try {
            const result = await api.put(`/users/update-by-admin/${adminId}`, data, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return result.data;
            } catch (error) {
                return rejectWithValue(error || 'Update account failed');
            }
        }
)

export const createAccount = createAsyncThunk(
    'accounts/createAccount',
    async (data, { rejectWithValue }) => {
        try {
            const result = await api.post(`/users`, data, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return result.data;
        }
        catch (error) {
            return rejectWithValue(error || 'Create account failed');
        }
    })

export const deleteAccount = createAsyncThunk(
    'accounts/deleteAccount',
    async (userId, { rejectWithValue }) => {
        const adminId = JSON.parse(localStorage.getItem('user'))._id
        try {
            const result = await api.delete(`/users/${userId}`, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                data: { adminId }
            });
            return result.data;
        }
        catch (error) {
            return rejectWithValue(error || 'Delete account failed');
        }
    })

export const groupAccount = createAsyncThunk(
    'accounts/groupAccount',
    async (data, { rejectWithValue }) => {
        try {
            const result = await api.post(`/groups`, {
                userIds: data.userIds,
                groupName: data.groupName, 
                description: data.description,
            }, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }); 
            return result.data;
        } catch (error) {
            return rejectWithValue(error || 'Group account failed');
        }
    }
)

export const fetchUserGroups = createAsyncThunk(
    'accounts/fetchUserGroups',
    async (_, { rejectWithValue }) => {
        try {
            const result = await api.get(`/groups`, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return result.data;
        } catch (error) {
            return rejectWithValue(error || 'Fetch user groups failed');
        }
    }
)

export const deleteUserGroup = createAsyncThunk(
    'accounts/deleteUserGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const result = await api.delete(`/group/${groupId}`, {
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return { ...result.data, groupId };
        } catch (error) {
            return rejectWithValue(error || 'Delete user group failed');
        }
    }
)

// Add user to group
export const addUserToGroup = createAsyncThunk(
    'accounts/addUserToGroup',
    async ({ groupId, userId }, { rejectWithValue }) => {
        try {
            const result = await api.post(`/groups/${groupId}`, { userId }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return result.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || 'Failed to add user to group');
        }
    }
);

// Remove user from group
export const removeUserFromGroup = createAsyncThunk(
    'accounts/removeUserFromGroup',
    async ({ groupId, userId }, { rejectWithValue }) => {
        try {
            const result = await api.delete(`/groups/${groupId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data: { userId }
            });
            return result.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || 'Failed to remove user from group');
        }
    }
);

// Delete group
export const deleteGroup = createAsyncThunk(
    'accounts/deleteGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const result = await api.delete(`/groups/${groupId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return { ...result.data, groupId };
        } catch (error) {
            return rejectWithValue(error?.response?.data || 'Failed to delete group');
        }
    }
);

export const getStatUser = createAsyncThunk(
    'accounts/statUser', async (__,{ rejectWithValue }) => {
        try {
            const result = await api.get(`/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return result.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || 'Failed to delete group');
        }
    }
)