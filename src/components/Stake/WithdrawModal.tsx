import { Backdrop, Box, Chip, Modal, Slider, Stack, SxProps, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import * as React from "react";
import { useAppSelector } from "../../state/hooks";
import { RootState } from "../../store";
import { removeDecimal } from "../../utils/format";

interface IWithdrawModalProps {
    open: boolean;
    close: Function;
    handleChange: Function;
    input: string;
    withdraw: Function;
}

const WithdrawModal: React.FC<IWithdrawModalProps> = ({ open, close, handleChange, input, withdraw }) => {
    const [slider, setSlider] = React.useState<number>(0);
    const stake = useAppSelector((state: RootState) => state.stake);

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

    const handleWithdraw = async () => {
        close();
        setSlider(0);
        await withdraw(input);
    }

    const adjust = (e: Event, val: number | number[]): void => {
        if (typeof val === 'number') {
            setSlider(val);
            const newVal: BigNumber = BigNumber.from(removeDecimal(stake.staked)).mul(val).div(100);
            handleChange(newVal.toString());            
        }
    }

    React.useEffect(() => {
        const item = document.getElementById('withdrawAmount');
        item?.addEventListener('wheel', () => {
            item.blur();
        });

        return () => {
            item?.removeEventListener('wheel', () => null);
        }
    });

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
            aria-labelledby="withdraw modal"
            aria-describedby="withdraw modal"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" component="div" sx={{ margin: '12px 0'}}>
                    Withdraw Stake
                </Typography>
                <Stack>
                    <TextField
                        fullWidth
                        id="withdrawAmount"
                        label="Amount to withdraw"
                        variant="outlined"
                        type="number"
                        value={input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                    />
                    <Box sx={{ margin: '12px 0', display: 'flex', justifyContent: 'space-evenly' }}>
                        <Slider
                            aria-label="Withdraw"
                            value={slider}
                            onChange={adjust}
                            step={1}
                            min={0}
                            max={100}
                            valueLabelFormat={((val: number) => `${val}%`)}
                            valueLabelDisplay="auto"
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
                                label="Withdraw"
                                sx={{ minWidth: "84px", fontSize: "12px" }}
                                clickable
                                onClick={handleWithdraw}
                            />
                    </Box>
            </Box>
        </Modal>
    );
}

export default WithdrawModal;