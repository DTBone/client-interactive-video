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
import whatIsCodespace from '~/assets/whatiscodespaces.webp';
import whyUseCodespace from '~/assets/profit.jpg';
import whereCreateCodespace from '~/assets/github.png';
import { Add, GitHub } from '@mui/icons-material';
import { toast } from 'react-toastify';

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
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [openCreateRepo, setOpenCreateRepo] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDescription, setNewRepoDescription] = useState('');

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
    if(!currentRepo) {
      toast.error('Please select a repository');
      setIsLoading(false);
      return;
    }
    if(newName === '') {
      toast.error('Please enter a codespace name');
      setIsLoading(false);
      return;
    }
    try {
      const response = await api.post('/codespaces', {
        codespaceName: newName,
        repositoryId: repos.find(repo => repo.name === currentRepo).id,
      });
      console.log(response.data);
      setCodespaces([response.data, ...codespaces]);
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

  const createNewRepository = async () => {
    if(newRepoName === '') {
      toast.error('Please enter a repository name');
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post('/codespaces/public-repositories/create', {
        name: newRepoName,
        description: newRepoDescription,
      });
      console.log(response.data);
      if(response.data.success) {
        setRepos([response.data.data, ...repos]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setOpenCreateRepo(false);
      setNewRepoName('');
      setNewRepoDescription('');
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
        window.open(response.data.loginUrl);
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
    if (user && user.githubAuth.accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    // Kiểm tra localStorage để chỉ hiện modal hướng dẫn lần đầu
    const hasSeenGuide = localStorage.getItem('codespaceGuideShown');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    setGuideStep(0);
    localStorage.setItem('codespaceGuideShown', 'true');
  };
  const handleNextGuide = () => setGuideStep((prev) => prev + 1);
  const handleBackGuide = () => setGuideStep((prev) => prev - 1);

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
        My Codespaces <IconButton color="primary" onClick={() => setShowGuide(true)}><InfoOutlinedIcon /></IconButton>
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
                  <Typography color="text.secondary">Create your first codespace now! 👉</Typography>
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
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: '20ch',
                  },
                }}}
              
            >
              <MenuItem value="" onClick={() => setOpenCreateRepo(true)}>
                  <Add />
                  Create new repository
              </MenuItem>
              {repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((repo) => (
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

      {/* Create New Repository Dialog */}
      <Dialog open={openCreateRepo} onClose={() => setOpenCreateRepo(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create New Repository</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Repository Name (*)"
            type="text"
            fullWidth
            variant="outlined"
            value={newRepoName}
            onChange={e => setNewRepoName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Repository Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newRepoDescription}
            onChange={e => setNewRepoDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateRepo(false)} color="secondary" variant="outlined" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={createNewRepository} color="primary" variant="contained" disabled={isLoading}>
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

      {/* Modal hướng dẫn lần đầu */}
      <Dialog open={showGuide} onClose={handleCloseGuide} maxWidth="sm" fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: 'sm',
          width: '100%',
          maxHeight: '80vh',
        },
      }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoOutlinedIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Introduction to Codespaces
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', minHeight: 320 }}>
          {guideStep === 0 && (
            <>
              <img src={whatIsCodespace} alt="IDE Cloud" style={{ width: '100%', marginBottom: 16, borderRadius: 10 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>
                What is Codespaces?
              </Typography>
              <Typography paragraph>
                <b>Codespaces</b> is an integrated development environment (IDE) on the cloud platform, allowing you to program, run and test source code directly without the need to install complex software on your personal computer.
              </Typography>
            </>
          )}
          {guideStep === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 3, gap: 2 }}>
              <GitHub color="primary" sx={{ fontSize: 48 }} onClick={() => window.open('https://github.com/features/codespaces', '_blank')}/>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Why use Codespace?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography paragraph sx={{ textAlign: 'left', display: 'inline-block' }}>
                  - Access programming environment anytime, anywhere.<br />
                  - No need to worry about environment conflicts, complex installations.<br />
                  - Easy to share, collaborate with friends or colleagues.<br />
                  - Integrate directly with GitHub to manage source code efficiently. <br />
                  - For more information, please visit <a style={{ color: 'blue' }} href="https://github.com/features/codespaces" target="_blank" rel="noopener noreferrer">GitHub Codespaces</a>.
                </Typography>
              <img src={whyUseCodespace} alt="Collaboration" style={{ width: '30%', marginBottom: 16, borderRadius: 10 }} />
              </Box>
            </Box>
          )}
          {guideStep === 2 && (
            <>
              <img src={whereCreateCodespace} alt="GitHub" style={{ width: '100%', height: 'auto', marginBottom: 16, borderRadius: 10 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Where can I create Codespace?
              </Typography>
              <Typography paragraph sx={{ textAlign: 'left', display: 'inline-block' }}>
                - <b>Direct on GitHub:</b> Go to your repository and select &quot;Code&quot; &rarr; &quot;Open with Codespaces&quot;.<br />
                - <b>Or use this interface:</b> Connect your GitHub account and create Codespace quickly and conveniently here!
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGuide} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleBackGuide} color="primary" disabled={guideStep === 0}>
            Back
          </Button>
          {guideStep < 2 ? (
            <Button onClick={handleNextGuide} color="primary" variant="contained">
              Next
            </Button>
          ) : (
            <Button onClick={handleCloseGuide} color="primary" variant="contained">
              Finish
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

