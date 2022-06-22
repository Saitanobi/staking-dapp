import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { RootState } from "../../store";
import { SAITANOBI } from "../../utils/addresses";
import { signer } from "../../utils/base";
import { tokenAbi } from "../../utils/tokenAbi";

interface IWalletState {
    ethBalance: string;
    saitanobiBalance: string;
    status: 'pending' | 'fulfilled' | 'failed' | 'standby';
}

const initialState: IWalletState = {
    ethBalance: '0', saitanobiBalance: '0', status: 'standby'
}

export const getBalances: any = createAsyncThunk('wallet/getBalances', async (): Promise<{ethBalance: string, saitanobiBalance: string}> => {
    try {
        const address = await signer.getAddress();
        const chainId = await signer.getChainId();
        //if (chainId !== 1) throw Error;
        const ethBalance = await signer.getBalance().then((res: BigNumber) => ethers.utils.formatEther(res.toString())).catch(() => '0');
        const tokenContract = new ethers.Contract(SAITANOBI, tokenAbi, signer.provider);
        const saitanobiBalance = await tokenContract.balanceOf(address).then((res: BigNumber) => ethers.utils.formatUnits(res.toString(), 'gwei')).catch(() => '0');
        return {
            ethBalance, saitanobiBalance
        }
    }
    catch(e) {
        console.log(e);
        return {
            ethBalance: '0',
            saitanobiBalance: '0'
        }
    }
});

export const walletSlice: Slice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {},
    extraReducers: {
        [getBalances.pending]: (state: IWalletState) => {
            state.status = 'pending';
        },
        [getBalances.failed]: (state: IWalletState) => {
            state.status = 'failed';
        },
        [getBalances.fulfilled]: (state: IWalletState, action: PayloadAction<{ethBalance: string, saitanobiBalance: string}>) => {
            state.ethBalance = action.payload.ethBalance;
            state.saitanobiBalance = action.payload.saitanobiBalance;
            state.status = 'fulfilled';
        }
    }
});

export const selectWallet = (state: RootState) => state.wallet;
export default walletSlice.reducer;