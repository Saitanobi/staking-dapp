import { TransactionReceipt } from "@ethersproject/providers";
import { Box, SxProps, Chip, Divider, Stack, Typography, CircularProgress } from "@mui/material";
import { Contract, ContractTransaction, ethers } from "ethers";
import * as React from "react";
import saitanobi from "../../assets/images/saitanobi.png";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { getStake } from "../../state/stake/stake";
import { addTx, updateTx } from "../../state/tx/tx";
import { getBalances } from "../../state/wallet/wallet";
import { AppDispatch, RootState } from "../../store";
import { SAITANOBI, stakingAddress } from "../../utils/addresses";
import { signer } from "../../utils/base";
import { stakeAbi } from "../../utils/stakeAbi";
import { tokenAbi } from "../../utils/tokenAbi";
import StakeModal from "./StakeModal";
import WithdrawModal from "./WithdrawModal";

interface IStakingCardProps {
    setCurrentTx: Function
}

const StakingCard: React.FC<IStakingCardProps> = ({ setCurrentTx }) => {
    const [modal, setModal] = React.useState<boolean>(false);
    const [wModal, setWModal] = React.useState<boolean>(false);
    const [apy, setApy] = React.useState<number>(0);
    const [stakeAmount, setStakeAmount] = React.useState<string>('0');
    const [withdrawAmount, setWithdrawAmount] = React.useState<string>('0');
    const { price, stake, wallet } = useAppSelector((state: RootState) => {
        return {
            price: state.price,
            stake: state.stake,
            wallet: state.wallet
        }
    });

    const dispatch: AppDispatch = useAppDispatch();

    React.useEffect(() => {
        if (price.status === 'fulfilled') {
            const apy1 = Number(stake.rewardPerToken[0]) * price.saitama;
            const apy2 = Number(stake.rewardPerToken[1]) * price.shinja;
            setApy(Math.round((apy1 + apy2) / (Number(stake.totalStaked) * price.saitanobi) * (36500)));
        }
    }, [price, stake]);

    const cardStyle: SxProps = {
        borderRadius: '8px',
        background: 'rgba(93, 93, 93, 0.4)',
        width: '80%',
        minWidth: '280px',
        maxWidth: '700px'
    }

    const approveFunc = async (): Promise<void> => {
        try {
            if (await signer.getChainId() !== 1) throw Error;
            const contract: Contract = new ethers.Contract(SAITANOBI, tokenAbi, signer.provider);
            const tx: ContractTransaction = await contract.connect(signer).approve(stakingAddress, ethers.utils.parseEther('999999999999999')).catch((e: Error) => console.log(e));
            dispatch(addTx({status: 'pending', hash: tx.hash}));
            setCurrentTx(tx.hash);
            const listen = async () => await signer.provider?.waitForTransaction(tx.hash);
            await listen().then(async (res: TransactionReceipt | undefined) => {
                if (res === undefined) {
                    dispatch(updateTx({ status: 'failed', hash: tx.hash }))
                } else {
                    dispatch(updateTx({ status: 'fulfilled', hash: res.transactionHash }));
                    await dispatch(getStake());
                }
            });
        }
        catch(e) {
            console.log(e);
        }
    }

    const stakeFunc = async (amount: string): Promise<void> => {
        try {
            if (await signer.getChainId() !== 1) throw Error;
            const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer.provider);
            const tx: ContractTransaction = await contract.connect(signer).stake(ethers.utils.parseUnits(amount, 'gwei'));
            dispatch(addTx({status: 'pending', hash: tx.hash}));
            setCurrentTx(tx.hash);
            const listen = async () => await signer.provider?.waitForTransaction(tx.hash);
            await listen().then(async (res: TransactionReceipt | undefined) => {
                if (res === undefined) {
                    dispatch(updateTx({ status: 'failed', hash: tx.hash }))
                } else {
                    dispatch(updateTx({ status: 'fulfilled', hash: res.transactionHash }));
                    await dispatch(getStake());
                    await dispatch(getBalances());
                }
            });
        }
        catch(e) {
            console.log(e);
        }
    }

    const claimFunc = async (): Promise<void> => {
        try {
            if (await signer.getChainId() !== 1) throw Error;
            const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer.provider);
            const tx: ContractTransaction = await contract.connect(signer).getReward();
            dispatch(addTx({status: 'pending', hash: tx.hash}));
            setCurrentTx(tx.hash);
            const listen = async () => await signer.provider?.waitForTransaction(tx.hash);
            await listen().then(async (res: TransactionReceipt | undefined) => {
                if (res === undefined) {
                    dispatch(updateTx({ status: 'failed', hash: tx.hash }))
                } else {
                    dispatch(updateTx({ status: 'fulfilled', hash: res.transactionHash }));
                    await dispatch(getStake());
                }
            });
        }
        catch(e) {
            console.log(e);
        }
    }

    const withdrawFunc = async (val: string): Promise<void> => {
        try {
             if (await signer.getChainId() !== 1) throw Error;
             setWithdrawAmount('0');
             const contract: Contract = new ethers.Contract(stakingAddress, stakeAbi, signer.provider);
             const tx: ContractTransaction = await contract.connect(signer).withdraw(ethers.utils.parseUnits(val, 'gwei'));
             dispatch(addTx({status: 'pending', hash: tx.hash}));
             setCurrentTx(tx.hash);
             const listen = async () => await signer.provider?.waitForTransaction(tx.hash);
             await listen().then(async (res: TransactionReceipt | undefined) => {
                 if (res === undefined) {
                     dispatch(updateTx({ status: 'failed', hash: tx.hash }))
                 } else {
                     dispatch(updateTx({ status: 'fulfilled', hash: res.transactionHash }));
                     await dispatch(getBalances());
                     await dispatch(getStake());
                 }
             });
        }
        catch(e) {
            console.log(e);
        }
    }

    return (
        <>
        <Box sx={cardStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: '12px' }}>
                <Box>
                    <Chip color="primary" label={
                        (stake.status === 'pending' || price.status === 'pending') ?
                        <React.Fragment>
                            <CircularProgress size={12} sx={{ color: 'white' }} />
                        </React.Fragment>
                        :
                        `APY ${apy}%`}
                    />
                </Box>
                <Box>
                    <Chip
                        variant="outlined"
                        color="warning"
                        label="Withdraw"
                        disabled={Number(stake.staked) < 1}
                        onClick={() => setWModal(true)}
                        clickable />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: '24px 0' }}>
                <Box>
                    <img src={saitanobi} alt="Saitanobi" width="76px" />
                </Box>
                <Typography variant="body1" component="div">
                    Stake Saitanobi
                </Typography>
                <Typography variant="body2" component="div">
                    {`Staked: ${Math.floor(Number(stake.staked)).toLocaleString('en-US')}`}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: '12px' }}>
                <Stack sx={{ textAlign: 'left' }}>
                    <Typography variant="caption" component="div">
                        {`Pending Saitama Rewards: ${Number(stake.rewards[0]).toLocaleString('en-US')}`}
                    </Typography>
                    <Typography variant="caption" component="div">
                        {`Pending Shinja Rewards: ${Number(stake.rewards[1]).toLocaleString('en-US')}`}
                    </Typography>
                </Stack>
            </Box>
            <Box>
                <Divider sx={{ background: 'rgba(93,93,93,0.8)' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: '16px 12px' }}>
                <Box>
                    <Chip
                        sx={{ background: 'green' }}
                        label="Claim"
                        disabled={Number(stake.rewards[0]) === 0 || Number(stake.rewards[1]) === 0}
                        onClick={async () => await claimFunc()}
                        clickable />
                </Box>
                <Box>
                    <Chip
                        color="secondary"
                        label="Approve"
                        sx={{ color: 'whitesmoke', minWidth: '76px', mr: '8px' }}
                        disabled={Number(wallet.saitanobiBalance) === 0 || Number(stake.allowance) > Number(wallet.saitanobiBalance)}
                        onClick={async () => await approveFunc()}
                        clickable />
                    <Chip
                        color="primary"
                        label="Stake"
                        sx={{ minWidth: '76px' }}
                        disabled={Number(stake.allowance) === 0 || Number(wallet.saitanobiBalance) === 0}
                        onClick={() => setModal(true)}
                        clickable />
                </Box>
            </Box>
        </Box>
        <StakeModal
            open={modal}
            close={() => setModal(false)}
            input={stakeAmount}
            handleChange={(val: string) => setStakeAmount(val)}
            stake={stakeFunc}
        />
        <WithdrawModal
            open={wModal}
            close={() => setWModal(false)}
            input={withdrawAmount}
            handleChange={(val: string) => setWithdrawAmount(val)}
            withdraw={withdrawFunc}
        />
        </>
    );
}

export default StakingCard;