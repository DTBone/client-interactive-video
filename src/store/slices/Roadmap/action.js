import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "~/Config/api.js";

export const createRoadMap = createAsyncThunk(
    'roadmap/createRoadMap',
    async (formData, { rejectWithValue }) => {
        try {
            const data = await api.post("/roadmap", {
                formData: formData
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);
export const getRoadMap = createAsyncThunk(
    'roadmap/getRoadMap',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await api.get(`/roadmap`, {
                params: {
                    userId
                },
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);