import { createSlice, PayloadAction, Selector, Slice } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface IConnectState {
    connected: boolean;
    address: string;
    ens: string | null;
    chainId: number;
}

const initialState: IConnectState = {
    connected: false,
    address: '',
    ens: null,
    chainId: 1
}

export const connectSlice: Slice = createSlice({
    name: 'connect',
    initialState,
    reducers: {
        makeConnection: (state: IConnectState, action: PayloadAction<IConnectState>) => {
            state.connected = action.payload.connected;
            state.address = action.payload.address;
            state.ens = action.payload.ens;
            state.chainId = action.payload.chainId;
        },
        changeAccount: (state: IConnectState, action: PayloadAction<{address: string, ens: string}>) => {
            state.address = action.payload.address;
            state.ens = action.payload.ens;
        },
        reset: (state: IConnectState) => {
            localStorage.clear();
            state.connected = false;
            state.address = '';
            state.ens = null;
        }
    }
});

export const { makeConnection, changeAccount, reset } = connectSlice.actions;
export const selectConnect: Selector = (state: RootState): IConnectState => state.connect;
export default connectSlice.reducer;
