import { createSlice } from '@reduxjs/toolkit';
import { 
    addUserToGroup,
    createAccount, 
    deleteAccount, 
    deleteGroup,
    deleteUserGroup, 
    fetchUserGroups, 
    getAllAccount, 
    groupAccount, 
    removeUserFromGroup,
    updateAccount 
} from './action';

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        accounts: [],
        count: 0,
        accountDetails: {},
        groups: [],
        loading: false,
        error: null,
        pagination: {
            total: 0,
            page: 1,
            limit: 25,
            totalPages: 0
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload.data.users;
                state.pagination = {
                    total: action.payload.total || 0,
                    page: action.payload.page || 1,
                    limit: action.payload.limit || 25,
                    totalPages: action.payload.totalPages || 1
                };
            })
            .addCase(getAllAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.accountDetails = action.payload.data;
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.loading = false;
                if (state.accounts) {
                    state.accounts.push(action.payload.data);
                }
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.loading = false;
                if (state.accounts) {
                    state.accounts = state.accounts.filter(
                        account => account._id !== action.meta.arg
                    );
                }
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(groupAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(groupAccount.fulfilled, (state, action) => {
                state.loading = false;
                if (!state.groups) {
                    state.groups = [action.payload.data];
                } else {
                    state.groups.push(action.payload.data);
                }
            })
            .addCase(groupAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserGroups.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload.data || [];
            })
            .addCase(fetchUserGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUserGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUserGroup.fulfilled, (state, action) => {
                state.loading = false;
                if (state.groups) {
                    state.groups = state.groups.filter(
                        group => group._id !== action.payload.groupId
                    );
                }
            })
            .addCase(deleteUserGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUserToGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUserToGroup.fulfilled, (state, action) => {
                state.loading = false;
                if (state.groups) {
                    const index = state.groups.findIndex(group => group._id === action.payload.data._id);
                    if (index !== -1) {
                        state.groups[index] = action.payload.data;
                    }
                }
            })
            .addCase(addUserToGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeUserFromGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUserFromGroup.fulfilled, (state, action) => {
                state.loading = false;
                if (state.groups) {
                    const index = state.groups.findIndex(group => group._id === action.payload.data._id);
                    if (index !== -1) {
                        state.groups[index] = action.payload.data;
                    }
                }
            })
            .addCase(removeUserFromGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.loading = false;
                if (state.groups) {
                    state.groups = state.groups.filter(group => group._id !== action.payload.groupId);
                }
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default accountSlice.reducer;