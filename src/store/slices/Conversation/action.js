import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "~/Config/api.js";

export const getConversationByFilter = createAsyncThunk(
    'conversation/getConversationByFilter',
    async (filter, { rejectWithValue }) => {
        try {
            const data = await api.get("/conversations", 
                {
                    params: filter
                }
            );
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);

export const createConversation = createAsyncThunk(
    'conversation/createConversation',
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/conversations",
                data
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);


export const getMessagesByConversationId = createAsyncThunk(
    'conversation/getMessagesByConversationId',
    async (obj, { rejectWithValue }) => {
        try {
            const data = await api.get(`/messages?conversationId=${obj.conversationId}&limit=${obj?.limit || 10}&page=${obj?.page || 1}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error || 'Get reviews failed');
        }
    }
);