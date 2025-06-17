import { useRef, useState } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, Paper, InputLabel, Alert, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Divider } from '@mui/material';
import * as XLSX from 'xlsx';
import {api} from '~/Config/api';

function AddAccountByExcel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState(null);
  const fileInputRef = useRef();

  const [data, setData] = useState([]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setAlert(null);
  
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      // Kiểm tra xem có đủ các cột cần thiết không
      const requiredColumns = ['fullname', 'email', 'phone', 'role'];
      const missingColumns = requiredColumns.filter(column => !jsonData.some(row => row[column]));
      if (missingColumns.length > 0) {
        setAlert({ type: 'error', message: `Missing required columns: ${missingColumns.join(', ')}` });
        return;
      }
      // Kiểm tra xem có dữ liệu không
      if (jsonData.length === 0) {
        setAlert({ type: 'error', message: 'No data found in the Excel file' });
        return;
      }
      setData(jsonData);
    };
  
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const worksheetData = [
      {
        fullname: 'Nguyễn Văn A',
        email: 'example@gmail.com',
        phone: '0909123456',
        role: 'student'
      }
    ];
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UsersTemplate');
  
    // Xuất file
    XLSX.writeFile(workbook, 'AddAccountTemplate.xlsx');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (data.length === 0) {
      setAlert({ type: 'error', message: 'No valid data found in Excel file.' });
      return;
    }
  
    try {
      const res = await api.post('/users/add-user-by-excel', { users: data });
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Users uploaded successfully!' });
      } else {
        setAlert({ type: 'error', message: res.data.message });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Upload failed.' });
      console.log(err);
    }
  };

  return (
    <Box maxWidth={'100%'} mx="auto" p={3} component={Paper}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Add Users by Excel File
      </Typography>
      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Instructions:
        </Typography>
        <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
          <ListItem>
            <ListItemText primary={
              <>The Excel file must contain the following columns: <b>fullname</b>, <b>email</b>, <b>phone</b>, <b>role</b></>
            } />
          </ListItem>
          <ListItem>
            <ListItemText primary={<>
              Required fields: <b>fullname</b>, <b>email</b>
            </>} />
          </ListItem>
          <ListItem>
            <ListItemText primary={
              <>Email must be valid and unique</>
            } />
          </ListItem>
          <ListItem>
            <ListItemText primary={
              <>Role (<b>role</b>) can be: <i>student</i>, <i>instructor</i>, <i>admin</i></>
            } />
          </ListItem>
          <ListItem>
            <ListItemText primary={
              <>The <b>password</b> will be generated automatically</>
            } />
          </ListItem>
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadTemplate}
          sx={{ mt: 2 }}
        >
          Download Template
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <InputLabel sx={{ mb: 1 }}>Select Excel file:</InputLabel>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ marginBottom: 16 }}
        />
        {selectedFile && (
          <Typography variant="body2" color="success.main" mb={1}>
            Selected: {selectedFile.name}
          </Typography>
        )}
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>
        )}
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Fullname</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.fullname}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.phone}</TableCell>
                            <TableCell>{item.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Divider sx={{ my: 2 }} />
        <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
            <Button variant="contained" color="error" onClick={() => {
                setSelectedFile(null);
                setData([]);
                fileInputRef.current.value = '';
                setAlert(null);
            }}>Clear</Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={!selectedFile}
        >
          Confirm Add Users
        </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddAccountByExcel;