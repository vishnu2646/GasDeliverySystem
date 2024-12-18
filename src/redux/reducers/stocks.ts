import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getRequest } from '../../service/apiService';

export const fetchStocks = createAsyncThunk('fetchStocks', async ({ apiUrl, currentUser }: { apiUrl: any, currentUser: any }) => {
    try {
        const url = `${apiUrl.url}/GetDeliveryPortal?ClId=${currentUser?.CLID}&AuthCode=${currentUser?.OTP}&databaseKey=${apiUrl?.databaseKey}`;
        const response = await getRequest(url);
        return response;
    } catch (error) {
        console.log(error);
    }
});

const stockSlice = createSlice({
    name: 'stocks',
    initialState: {
        loading: false,
        data: null as any,
        error: undefined as string | undefined,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchStocks.pending, (state) => {
            state.loading = true;
            state.data = null;
            state.error = undefined;
        })
        .addCase(fetchStocks.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = undefined;
        })
        .addCase(fetchStocks.rejected, (state, action) => {
            state.loading = false;
            state.data = null;
            state.error = action.error?.message;
        });
    },
});

export default stockSlice.reducer;
