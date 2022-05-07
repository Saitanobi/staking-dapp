import { createAsyncThunk, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { BigNumber, Contract, ethers } from "ethers";
import { RootState } from "../../store";
import { SAITANOBI, stakingAddress } from "../../utils/addresses";
import { signer } from "../../utils/base";
import { stakeAbi } from "../../utils/stakeAbi";
import { tokenAbi } from "../../utils/tokenAbi";

interface IStakeState {
    rewards: string[];
    staked: string;
    allowance: string;
    rewardPerToken: string[];
    totalStaked: string;
    status: 'pending' | 'fulfilled' | 'failed' | 'standby';
}

const initialState: IStakeState = {
    rewards: ['0', '0', '0'],
    rewardPerToken: ['0', '0', '0'],
    staked: '0',
    allowance: '0',
    totalStaked: '0',
    status: 'standby'
}

export const getStake: any = createAsyncThunk('stake/getStake', async () => {
    try {
        let rewards = ['0', '0', '0'];
        let staked = '0';
        let allowance = '0';
        const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer?.provider);
        const token: Contract = new ethers.Contract(SAITANOBI, tokenAbi, signer?.provider);
        const rewardPerToken = await contract.rewardPerToken().then((res: BigNumber[]) => {
            return res.map((item: BigNumber) => item.toString());
        }).catch(() => { return ['0', '0', '0'] });
        const totalStaked = await contract.totalSupply().then((res: BigNumber) => ethers.utils.formatUnits(res, 'gwei'));
        if (signer?.provider !== undefined) {
            const address = await signer.getAddress();
            rewards = await contract.earned(address).then((res: BigNumber[]) => {
                return res.map((item: BigNumber, index: number) => {
                    return ethers.utils.formatUnits(item.toString(), index === 3 ? 18 : 9);
                });
            });
            staked = await contract.balanceOf(address).then((res: BigNumber) => ethers.utils.formatUnits(res.toString(), 'gwei'));
            allowance = await token.allowance(address, stakingAddress).then((res: BigNumber) => ethers.utils.formatUnits(res.toString(), 'gwei'));
        }

        return {
            rewardPerToken, rewards, staked, allowance, totalStaked
        }
    }
    catch(e) {
        console.log(e);

        return {
            rewardPerToken: ['0', '0', '0'],
            rewards: '0',
            staked: '0',
            allowance: '0',
            totalStaked: '0'
        }
    }
});

export const stakeSlice: Slice = createSlice({
    name: 'stake',
    initialState,
    reducers: {},
    extraReducers: {
        [getStake.pending]: (state: IStakeState) => {
            state.status = 'pending';
        },
        [getStake.failed]: (state: IStakeState) => {
            state.status = 'failed';
        },
        [getStake.fulfilled]: (state: IStakeState, action: PayloadAction<any>) => {
            state.allowance = action.payload.allowance;
            state.staked = action.payload.staked;
            state.rewards = action.payload.rewards;
            state.rewardPerToken = action.payload.rewardPerToken;
            state.totalStaked = action.payload.totalStaked;
            state.status = 'fulfilled';
        }
    }
});

export const selectStake = (state: RootState) => state.stake;
export default stakeSlice.reducer;