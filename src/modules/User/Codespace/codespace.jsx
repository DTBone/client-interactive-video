import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Tooltip,
  IconButton,
  Stack,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { api } from '~/Config/api';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useLocation } from 'react-router-dom';

export default function Codespace() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(location?.state?.isLoggedIn || false);
  const [codespaces, setCodespaces] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCodespace, setSelectedCodespace] = useState(null);
  const [newName, setNewName] = useState('');
  const [newBranch, setNewBranch] = useState('main');
  const [repos, setRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [isLoading, setIsLoading] = useState(false);
  const fetchCodespaces = async () => {
    try {
      const response = await api.get('/codespaces');
      console.log(response.data);
      setCodespaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const createCodespace = async () => {
    setIsLoading(true);
    console.log(repos.find(repo => repo.name === currentRepo));
    try {
      const response = await api.post('/codespaces', {
        codespaceName: newName,
        repositoryId: repos.find(repo => repo.name === currentRepo).id,
      });
      setCodespaces([...codespaces, response.data]);
      handleCloseCreate();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepos = async () => {
    try {
      const response = await api.get('/codespaces/public-repositories/get');
      setRepos(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  // Handlers
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
    setNewName('');
    setNewBranch('main');
    setCurrentRepo('');
  };
  const handleOpenDelete = (codespace) => {
    setSelectedCodespace(codespace);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedCodespace(null);
  };
  const handleOpenGitHub = async () => {
    try {
      const response = await api.get('/github/auth/login/url');
      if (response.data.loginUrl) {
        window.open(response.data.loginUrl, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchCodespaces();
    fetchRepos();
  }, []);

  useEffect(() => {
    
    console.log(user);
    if (user && user.githubAuth) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleDeleteCodespace = async () => {
    try {
      await api.delete(`/codespaces/${selectedCodespace.codespaceId}`);
      setCodespaces(codespaces.filter(c => c.codespaceId !== selectedCodespace.codespaceId));
      handleCloseDelete();
    } catch (error) {
      console.error(error);
    }
  };
  

  // UI
  return (
    <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1100, mx: 'auto', position: 'relative' }}>
      <Button disabled={isLoggedIn && user.githubAuth} variant="contained" sx={{ mb: 2, gap: 1 }} color="primary" onClick={handleOpenGitHub}>
        <GitHubIcon />
        {isLoggedIn && user.githubAuth ? (
          <Typography>
            Connected
          </Typography>
        ) : 'Please connect your GitHub account to create a codespace'}
      </Button>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Codespaces
      </Typography>
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>IDE</TableCell>
              <TableCell>Machine</TableCell>
              <TableCell>Web URL</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codespaces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">No codespaces found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              codespaces.map((c) => (
                <TableRow key={c.codespaceId} hover>
                  <TableCell>{c.codespaceName}</TableCell>
                  <TableCell>
                    <Typography color={c.state === 'Available' ? 'success.main' : 'text.secondary'} fontWeight={500}>
                      {c.state}
                    </Typography>
                  </TableCell>
                  <TableCell>{c.createdAt}</TableCell>
                  <TableCell>{c.ide || 'VS Code'}</TableCell>
                  <TableCell>{c.machine.name}</TableCell>
                  <TableCell>{c.webUrl}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Open Codespace">
                        <IconButton color="primary" onClick={() => window.open(c.webUrl, '_blank')}>
                          <OpenInNewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Details">
                        <IconButton color="info">
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleOpenDelete(c)}>
                          <DeleteIcon />
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

      {/* Floating Action Button for Create */}
      <Tooltip title="Create new Codespace">
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenCreate}
          disabled={!isLoggedIn || !user.githubAuth}
          sx={{ position: 'fixed', bottom: { xs: 24, md: 40 }, right: { xs: 24, md: 40 }, zIndex: 1200 }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Create Codespace Dialog */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="xs" fullWidth>
        <DialogTitle>Create New Codespace</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="repo-select-label">Repository (*)</InputLabel>
            <Select
              labelId="repo-select-label"
              id="repo-select"
              label="Repository (*)"
              value={currentRepo}
              onChange={(e) => setCurrentRepo(e.target.value)}
              sx={{ mb: 2, color: 'black' }}
            >
              {repos.map((repo) => (
                <MenuItem key={repo.id} value={repo.name}>
                  {repo.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Codespace Name (*)"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate} color="secondary" variant="outlined" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={createCodespace} color="primary" variant="contained" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle color="error.main">Delete Codespace</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete codespace <b>{selectedCodespace?.codespaceName}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="secondary" variant="outlined" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteCodespace} color="error" variant="contained" disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

