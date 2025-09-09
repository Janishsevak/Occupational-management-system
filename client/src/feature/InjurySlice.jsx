import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateInjuryAsync = createAsyncThunk(
    'injury/updateInjury',
    async ({ idToupdate,formData,origin },{ rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/v1/injurydata/updateinjurydata/${idToupdate}`,
                formData,
                { headers: { 'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "x-origin": origin ,
                 },
                 }
            );
            return response.data.entries;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update injury');
        }
    }) ;
export const fetchInjuriesAsync = createAsyncThunk(
    'injury/fetchInjuries',
    async ({origin},{ rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/v1/injurydata/injurydata`,
                { headers: { 'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "x-origin": origin
                 },
                 }
            );
            console.log("Injury data fetched successfully:", response.data);
            return response.data.entries;
            
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch injuries');
        }
    });

export const addInjuryAsync = createAsyncThunk(
    'injury/addInjury',
    async ( { formData, origin } , { rejectWithValue }) => {
        console.log("Adding injury with formData:", formData);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/injurydata/injuryentry`,
                formData,
                { headers: { 'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "x-origin": origin
                 },
                 }
            );
            console.log("Injury added successfully:", response.data.entries);
            return response.data.entries; // Assuming the response contains the added injury in entries[0]
            
            
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add injury');
        }
    }
)
export const deleteInjuryAsync = createAsyncThunk(
    'injury/deleteInjury',
    async ({ idTodelete, origin }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/api/v1/injurydata/deleteinjurydata/${idTodelete}`,
                { headers: { 'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "x-origin": origin
                 },
                 }
            );
            return response.data.entries;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete injury');
        }
    }
);

const injurySlice = createSlice({
    name: 'injury',
    initialState: {
        injuries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    
    extraReducers: (builder) => {
        builder
            .addCase(fetchInjuriesAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInjuriesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.injuries = action.payload;
            })
            .addCase(fetchInjuriesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateInjuryAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateInjuryAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.injuries.findIndex(injury => injury.id === action.payload.data.id);
                if (index !== -1) {
                    state.injuries[index] = action.payload.data;
                }
            })
            .addCase(updateInjuryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update injury';
            })
            .addCase(addInjuryAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(addInjuryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.injuries.push(action.payload);
            })
            .addCase(addInjuryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add injury';
            })
            .addCase(deleteInjuryAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteInjuryAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.injuries = state.injuries.filter(injury => injury.id !== action.payload.id);
            })
            .addCase(deleteInjuryAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete injury';
            });

    }   
});

export const { addInjury, updateInjury, deleteInjury,fectchinjury } = injurySlice.actions;
export default injurySlice.reducer;