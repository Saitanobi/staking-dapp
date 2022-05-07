import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { RootState } from "../../store";

interface IPriceState {
    ethereum: number;
    saitanobi: number;
    saitama: number;
    shinja: number;
    shib: number;
    status: 'pending' | 'fulfilled' | 'failed' | 'standby';
}

interface IResponse {
    name: string;
    symbol: string;
    price: number;
    marketCap: string;
    circSupply: number;
}

const initialState: IPriceState = {
    ethereum: 0,
    saitanobi: 0,
    saitama: 0,
    shinja: 0,
    shib: 0,
    status: 'standby'
}

export const getPrices: any = createAsyncThunk('price/getPrices', async (): Promise<IResponse[]> => {
    try {
        const url: string = `${process.env.REACT_APP_PRICE_API}`;
        const res: AxiosResponse = await axios(url);
        return res.data;
    }
    catch(e) {
        console.log(e);

        return [];
    }
});

export const priceSlice: Slice = createSlice({
    name: 'price',
    initialState,
    reducers: {},
    extraReducers: {
        [getPrices.pending]: (state: IPriceState) => {
            state.status = 'pending';
        },
        [getPrices.failed]: (state: IPriceState) => {
            state.status = 'failed';
        },
        [getPrices.fulfilled]: (state: IPriceState, action: PayloadAction<IResponse[]>) => {
            if (action.payload.length > 0) {
                state.ethereum = action.payload.find((item: IResponse) => item.symbol === "ETH")?.price ?? 0;
                state.saitanobi = action.payload.find((item: IResponse) => item.symbol === "SAITANOBI")?.price ?? 0;
                state.saitama = action.payload.find((item: IResponse) => item.symbol === "SAITAMA")?.price ?? 0;
                state.shinja = action.payload.find((item: IResponse) => item.symbol === "SHINJA")?.price ?? 0;
                state.shib = action.payload.find((item: IResponse) => item.symbol === "SHIB")?.price ?? 0;
                state.status = 'fulfilled';
            } else {
                state.status = 'failed';
            }
        }
    }
});

export const selectPrice = (state: RootState) => state.price;
export default priceSlice.reducer;