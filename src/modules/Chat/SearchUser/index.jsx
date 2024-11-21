import { useState, useEffect } from 'react';
import {
    Popper,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    ClickAwayListener,
    Box,
    CircularProgress,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const SearchUsersPopper = ({
                               anchorEl,
                               searchResults,
                               onSelectUser,
                               loading,
                               open,
                               onClose
                           }) => {
    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{
                width: 300,
                marginTop: '8px',
                zIndex: 1300
            }}
        >
            <ClickAwayListener onClickAway={onClose}>
                <Paper
                    elevation={3}
                    sx={{
                        maxHeight: '400px',
                        overflow: 'auto',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px'
                    }}
                >
                    {loading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            p: 2
                        }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : searchResults.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {searchResults.map((user) => (
                                <ListItem
                                    key={user._id}
                                    button
                                    onClick={() => {
                                        onSelectUser(user);
                                        onClose();
                                    }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        },
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    <ListItemAvatar>
                                        {user.profile?.picture ? (
                                            <Avatar src={user.profile.picture} />
                                        ) : (
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {user.profile?.full_name || user.profile?.fullname || 'Unknown User'}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {user.email}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{
                            p: 2,
                            textAlign: 'center',
                            color: 'text.secondary'
                        }}>
                            <Typography variant="body2">
                                No users found
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </ClickAwayListener>
        </Popper>
    );
};

export default SearchUsersPopper;