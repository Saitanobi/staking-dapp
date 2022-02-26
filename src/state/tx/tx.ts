import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { Contract, ContractTransaction, ethers } from "ethers";
import { RootState } from "../../store";
import { SAITANOBI, stakingAddress } from "../../utils/addresses";
import { signer } from "../../utils/base";
import { stakeAbi } from "../../utils/stakeAbi";
import { tokenAbi } from "../../utils/tokenAbi";

interface ITxState {
    status: 'pending' | 'fulfilled' | 'failed' | 'standby';
    hashes: IHashState[];
}

interface IHashState {
    hash: string;
    status: 'pending' | 'fulfilled' | 'failed' | 'standby';
}

const initialState: ITxState = {
    status: 'standby',
    hashes: []
}

export const approveStake: any = createAsyncThunk('tx/approve', async (): Promise<ContractTransaction | void> => {
    try {
        if (await signer.getChainId() !== 1) throw Error;
        const contract: Contract = new ethers.Contract(SAITANOBI, tokenAbi, signer.provider);
        const tx: ContractTransaction = await contract.connect(signer).approve(stakingAddress, ethers.utils.parseEther('9999999999999999999'));
        return tx;
    }
    catch(e) {
        console.log(e);
    }
});

export const stakeToken: any = createAsyncThunk('tx/stake', async (args: {amount: string}): Promise<ContractTransaction | void> => {
    try {
        if (await signer.getChainId() !== 1) throw Error;
        const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer.provider);
        const tx: ContractTransaction = await contract.connect(signer).stake(args.amount);
        return tx;
    }
    catch(e) {
        console.log(e);
    }
});

export const claimRewards: any = createAsyncThunk('tx/claim', async (): Promise<ContractTransaction | void> => {
    try {
        if (await signer.getChainId() !== 1) throw Error;
        const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer.provider);
        const tx: ContractTransaction = await contract.connect(signer).getReward();
        return tx;
    }
    catch(e) {
        console.log(e);
    }
});

export const withdraw: any = createAsyncThunk('tx/withdraw', async (args: {amount: string}): Promise<ContractTransaction | void> => {
    try {
        if (await signer.getChainId() !== 1) throw Error;
        const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer.provider);
        const tx: ContractTransaction = await contract.connect(signer).withdraw(args.amount);
        return tx;
    }
    catch(e) {
        console.log(e);
    }
});

export const exit: any = createAsyncThunk('tx/exit', async (): Promise<ContractTransaction | void> => {
    try {
        if (await signer.getChainId() !== 1) throw Error;
        const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer.provider);
        const tx: ContractTransaction = await contract.connect(signer).exit();
        return tx;
    }
    catch(e) {
        console.log(e);
    }
});

export const txSlice: Slice = createSlice({
    name: 'tx',
    initialState,
    reducers: {
        addTx: (state: ITxState, action: PayloadAction<IHashState>) => {
            state.hashes.push({
                status: action.payload.status,
                hash: action.payload.hash
            });
        },
        updateTx: (state: ITxState, action: PayloadAction<IHashState>) => {
            const index = state.hashes.findIndex(h => h.hash === action.payload.hash);
            state.hashes[index].status = action.payload.status;
        }
    }
});

export const { addTx, updateTx } = txSlice.actions;
export const selectTx = (state: RootState) => state.tx;
export default txSlice.reducer;
