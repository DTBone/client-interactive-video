import { Delete, Edit, PersonAdd, Search } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Input } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAccount } from '~/store/slices/Account/action';
import '~/index.css';
import EditUserModal from "~/modules/Admin/IntructorMg/EditModal/index.jsx";
import AddInstructorModal from "~/modules/Admin/IntructorMg/AddModal/index.jsx";

const InstructorManager = () => {
  // Sample data structure - replace with your actual data fetching logic
  const [instructors, setInstructors] = useState(useSelector(state => state.account.accounts)); 
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  
  // Filter instructors based on search query
  const filteredInstructors = instructors.filter(instructor => {
    if(instructor.role !== 'instructor') return false;
    return instructor.profile.fullname.toLowerCase().includes(searchQuery.toLowerCase() 
  );
});
  const handleEdit = (intructor) => {
      setSelectedInstructor(intructor)
      console.log(intructor)    
      setOpen(true)
  }
    const handleAdd = () => {
      setOpenAdd(true)
    }
  const dispatch = useDispatch();
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    useEffect(() => {
        const getUsers = async () =>{
            const result = await dispatch(getAllAccount(userId));
            if (getAllAccount.fulfilled.match(result)) {
                
                setInstructors(result.payload.data);
            }
            else
                console.log(result.payload.message)
        }
        if(!instructors || instructors.length === 0) {
            getUsers();
        }
        }, [userId, dispatch, instructors]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructor Manager</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PersonAdd size={20} />
          Add Instructor
        </Button>
          {openAdd && <AddInstructorModal open={openAdd} setOpen={setOpenAdd}/>}
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md rounded-lg">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search instructors..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstructors.map((instructor, index) => (
          <Card key={index} className="flex flex-col">
            <CardContent className="flex items-center p-6 space-x-4">
              <div className="size-10 rounded-full overflow-hidden">
                <img
                  src={instructor.profile.picture || 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-job-candidate-post-employee-png-png-image_10267263.png'}
                  alt={instructor.profile.fullname}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{instructor.profile.fullname}</h3>
                <p className="text-sm text-gray-500">{instructor.role}</p>
              </div>
            </CardContent>
              {open && <EditUserModal open={open} setOpen={setOpen} userData={selectedInstructor}/>}
            <Box className="flex flex justify-end space-x-2 border-t p-4">
              <Button onClick={() => handleEdit(instructor)} sx={{backgroundColor: '#1996e2'}} variant="outline" size="sm" className="flex items-center gap-2">
                <Edit size={16} />
                Edit
              </Button>
              <Button sx={{backgroundColor: '#C13746'}} variant="destructive" size="sm" className="flex items-center gap-2">
                <Delete size={16} />
                Delete
              </Button>
            </Box>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorManager;