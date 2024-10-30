import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SelectContentType = () => {
    const [contentType, setContentType] = useState('');

    const handleChange = (event) => {
        setContentType(event.target.value);
    };
    return (
        <FormControl fullWidth>
            <InputLabel id="content-type-select-label">Chọn loại</InputLabel>
            <Select
                labelId="content-type-select-label"
                id="content-type-select"
                value={contentType}
                label="Chọn loại"
                onChange={handleChange}
            >
                <MenuItem value="Reading">Reading</MenuItem>
                <MenuItem value="Video">Video</MenuItem>
                <MenuItem value="Practice Quiz">Practice Quiz</MenuItem>
                <MenuItem value="Programming Assignment">Programming Assignment</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SelectContentType
