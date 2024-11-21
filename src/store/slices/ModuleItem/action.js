import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '~/Config/api';

export const createLecture = createAsyncThunk(
    'module/addNewModuleItem',
    async (formData, { rejectWithValue }) => {
        try {
            console.log("form data: ", formData.get('video'))
            const { data } = await api.post(
                `/modules/${formData.get('moduleId')}/videos`,
                {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    references: JSON.parse(formData.get('references')),
                    video: formData.get('video')
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);