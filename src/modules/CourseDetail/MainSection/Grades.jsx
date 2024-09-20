import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import { AccessTime, Code } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
const Grades = () => {
    const { courseID } = useParams();

    const navigate = useNavigate();

    const handleRowClick = (assignmentId, moduleID) => {
        navigate(`/learn/${courseID}/programming/${moduleID.toLowerCase().replace(/\s+/g, '/')}/${assignmentId.toLowerCase().replace(/\s+/g, '-')}`);
    };
    const assignments = [
        {
            name: 'Percolation',
            type: 'Programming Assignment',
            status: 'Overdue',
            due: 'Sep 9 11:59 PM PDT',
            weight: '20%',
            icon: 'clock',
            grade: '--',
            module: 'module 1',
        },
        {
            name: 'Deques and Randomized Queues',
            type: 'Programming Assignment',
            status: 'Overdue',
            due: 'Sep 13 11:59 PM PDT',
            weight: '20%',
            icon: 'clock',
            grade: '--',
            module: 'module 2',
        },
        {
            name: 'Collinear Points',
            type: 'Programming Assignment',
            status: 'Overdue',
            due: 'Sep 16 11:59 PM PDT',
            weight: '20%',
            icon: 'clock',
            grade: '--',
            module: 'module 3',
        },
        {
            name: '8 Puzzle',
            type: 'Programming Assignment',
            status: '--',
            due: 'Sep 20 11:59 PM PDT',
            weight: '20%',
            icon: 'code',
            grade: '--',
            module: 'module 4',
        },
        {
            name: 'Kd-Trees',
            type: 'Programming Assignment',
            status: '--',
            due: 'Sep 25 11:59 PM PDT',
            weight: '20%',
            icon: 'code',
            grade: '--',
            module: 'module 1',
        },
    ];

    return (
        <div>
            <Typography variant='h4' className='font-bold pb-4'>Grades</Typography>
            <TableContainer component={Paper} className='shadow-lg'>
                <Table className='min-w-full'>
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Due</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments.map((assignment, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                                <TableCell className="flex items-center space-x-2">

                                    <div className="flex flex-row space-x-3">
                                        {assignment.icon === 'clock' ? (
                                            <AccessTime className="text-yellow-500" />
                                        ) : (
                                            <Code className="text-blue-500" />
                                        )}
                                        <div>

                                            <div onClick={() => handleRowClick(assignment.name, assignment.module)} className="text-blue-600 font-medium hover:underline">{assignment.name}</div>
                                            <div className="text-gray-500 text-sm">{assignment.type}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{assignment.status}</TableCell>
                                <TableCell>{assignment.due}</TableCell>
                                <TableCell>{assignment.weight}</TableCell>
                                <TableCell>{assignment.grade}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}

export default Grades
