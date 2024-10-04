import React from 'react'
import { useTab } from '../Context/TabContext'
import { Divider, Typography } from '@mui/material';
import CodeDisplay from '../CodeDisplay/CodeDisplay';

const DetailSubmission = () => {
    const { submissionData } = useTab();
    return (
        <div className='p-4 flex flex-col justify-start h-screen'>
            <Typography
                fontSize="1.2rem"
                fontWeight="bold"
                sx={{
                    color: submissionData.status.toLowerCase() === "accepted" ? "#3fb55d" : "#ef4743",
                    textTransform: "capitalize",
                }}
            >
                {submissionData.status}
            </Typography>

            <Typography
                fontSize="0.8rem"
                display="flex" // Sử dụng flex để căn chỉnh nội dung
                alignItems="center" // Căn giữa theo chiều dọc
            >
                submitted at
                <span style={{ marginLeft: '4px' }}> {/* Thêm khoảng cách giữa văn bản và thời gian */}
                    {new Date(submissionData.createdAt).toLocaleString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour12: false,
                    })}
                </span>
            </Typography>

            <div className='flex flex-row items-center gap-3 my-3 hidden'>
                <Typography >Code</Typography>
                <Divider orientation="vertical" variant="middle" flexItem sx={{ height: '16px', bgcolor: 'gray.400' }} />
                <Typography sx={{ textTransform: "capitalize", }}>{submissionData.language}</Typography>
            </div>
            <div className="min-h-full" style={{ height: '100vh' }}>
                <CodeDisplay submissionData={submissionData} />
            </div>



        </div>
    )
}

export default DetailSubmission
