import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRequestsAsync = createAsyncThunk(
  "request/fetchRequests",
  async ({ origin }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/request/fetchrequest`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-origin": origin,
          },
        }
      );
      return response.data.requests;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch requests"
      );
    }
  }
);

export const raiseRequestAsync = createAsyncThunk(
  "request/raiseRequest",
  async ({ model, recordId, reason, origin }, { rejectWithValue }) => {
    console.log("tablename", model);
    try {
      const idToDelete =
        Array.isArray(recordId) && recordId.length > 0 ? recordId[0] : null;
        console.log("idToDelete", idToDelete);

      if (!idToDelete) {
        console.error("No record ID found in array");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/request/deleterequest`,
        { model, recordId:idToDelete , reason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-origin": origin,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to raise request"
      );
    }
  }
);

export const processDeleteRequestAsync = createAsyncThunk(
  "request/processDeleteRequest",
  async ({ requestId, action, origin }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/request/actiononrequest/${requestId}`,
        { action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-origin": origin,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to process request"
      );
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState: {
    requests: [],
    deleteRequests: [],
    editRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    deleterequest: (state,action) => {
      state.deleteRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    editrequest: (state,action) => {
      state.editRequests = action.payload; // set edit request data
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteRequests = action.payload;
      })
      .addCase(fetchRequestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(raiseRequestAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(raiseRequestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(raiseRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(processDeleteRequestAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(processDeleteRequestAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(
          (req) => req.id === action.payload.requestId
        );
        if (index !== -1) {
          state.requests[index] = {
            ...state.requests[index],
            status: action.payload.status,
          };
        }
      })
      .addCase(processDeleteRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { deleterequest,editrequest} = requestSlice.actions;
export default requestSlice.reducer;
