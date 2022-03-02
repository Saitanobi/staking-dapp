import { Backdrop, Box, Chip, Modal, Stack, SxProps, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import * as React from "react";
import { useAppSelector } from "../../state/hooks";
import { RootState } from "../../store";
import { removeDecimal } from "../../utils/format";

interface IStakeModalProps {
    open: boolean;
    close: Function;
    handleChange: Function;
    input: string;
    stake: Function;
}

const StakeModal: React.FC<IStakeModalProps> = ({ open, close, input, handleChange, stake }) => {
    const wallet = useAppSelector((state: RootState) => state.wallet);

    const modalStyle: SxProps = {
        position: "absolute" as "absolute",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 280,
        bgcolor: "background.default",
        borderRadius: "8px",
        p: '12px',
        minHeight: '300px'
    };

    const handleStake = async (): Promise<void> => {
        close();
        await stake(input);
    }

    React.useEffect(() => {
        const item = document.getElementById('stakeAmount');
        item?.addEventListener('wheel', () => {
            item.blur();
        });

        return () => {
            item?.removeEventListener('wheel', () => null);
        }
    })

    return (
        <Modal
            open={open}
            onClose={() => close()}
            onBackdropClick={() => close()}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            disableAutoFocus
            sx={{ border: "0px" }}
            aria-labelledby="stake modal"
            aria-describedby="stake modal"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" component="div" sx={{ margin: '12px 0'}}>
                    Stake tokens
                </Typography>
                <Stack>
                    <TextField
                        fullWidth
                        id="stakeAmount"
                        label="Amount to Stake"
                        variant="outlined"
                        type="number"
                        value={input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                    />
                    <Box sx={{ margin: '12px 0', display: 'flex', justifyContent: 'space-evenly' }}>
                        <Chip
                            size="small"
                            color="default"
                            label="25%"
                            variant="outlined"
                            clickable
                            onClick={() => handleChange((BigNumber.from(removeDecimal(wallet.saitanobiBalance)).div(4)).toString())}
                        />
                        <Chip
                            size="small"
                            color="default"
                            label="50%"
                            variant="outlined"
                            clickable
                            onClick={() => handleChange((BigNumber.from(removeDecimal(wallet.saitanobiBalance)).div(2)).toString())}
                        />
                        <Chip
                            size="small"
                            color="default"
                            label="75%"
                            variant="outlined"
                            clickable
                            onClick={() => handleChange((BigNumber.from(removeDecimal(wallet.saitanobiBalance)).div(4).mul(3)).toString())}
                        />
                        <Chip
                            size="small"
                            color="default"
                            label="100%"
                            variant="outlined"
                            clickable
                            onClick={() => handleChange(BigNumber.from(removeDecimal(wallet.saitanobiBalance)).toString())}
                        />
                    </Box>
                </Stack>
                <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                p: "12px",
                            }}
                        >
                            <Chip
                                size="small"
                                color="secondary"
                                label="Close"
                                sx={{
                                    minWidth: "84px",
                                    color: "whitesmoke",
                                    fontSize: "12px",
                                }}
                                clickable
                                onClick={() => close()}
                            />
                            <Chip
                                size="small"
                                color="primary"
                                label="Stake"
                                sx={{ minWidth: "84px", fontSize: "12px" }}
                                clickable
                                onClick={handleStake}
                            />
                        </Box>
            </Box>
        </Modal>
    );
}

export default StakeModal;