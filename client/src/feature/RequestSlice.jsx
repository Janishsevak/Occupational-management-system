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
    try {
      if (!Array.isArray(recordId) || recordId.length === 0) {
        return rejectWithValue("No record IDs provided");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/request/deleterequest`,
        { model, recordId, reason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-origin": origin,
          },
        }
      );
      console.log("resposnse", response);
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
  async ({ requestIds, action, origin }, { rejectWithValue }) => {
    console.log("id to delete",requestIds)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/request/actiononrequest`,
        { requestIds, action, origin},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    selectedData: [],
    requests:[],
    deleteRequests: [],
    editRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedData: (state, action) => {
      state.selectedData = action.payload;
    },
    clearSelectedData: (state) => {
      state.selectedData = [];
    },
    setdeleteRequests: (state, action) => {
      state.deleteRequests = action.payload;
    },
    editrequest: (state, action) => {
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
        state.deleteRequests.push(action.payload);
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

        // Bulk results from backend
        const results = action.payload?.results || [];

        if (!Array.isArray(state.requests)) {
          state.requests = []; // ✅ ensure it's always an array
        }

        results.forEach((result) => {
          const index = state.requests.findIndex(
            (req) => req.id === result.requestId
          );
          if (index !== -1) {
            state.requests[index] = {
              ...state.requests[index],
              status: result.status,
            };
          }
        });
      })
      .addCase(processDeleteRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const {
  setSelectedData,
  clearSelectedData,
  editrequest,
  setdeleteRequests,
} = requestSlice.actions;
export default requestSlice.reducer;
