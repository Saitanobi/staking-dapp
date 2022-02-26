import { AccountBalanceWalletOutlined } from "@mui/icons-material";
import {
    Avatar,
    Backdrop,
    Chip,
    Fade,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    SxProps,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { reset } from "../../state/connect/connect";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { AppDispatch, RootState } from "../../store";
import metamask from "../../assets/images/metamask.png";
import walletconnect from "../../assets/images/walletconnect.png";
import saitanobi from "../../assets/images/saitanobi.png";
import ethereum from "../../assets/images/ethereum_circle.png";

interface IWalletProps {
    connectFunc: Function;
}

const Wallet: React.FC<IWalletProps> = ({ connectFunc }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const { connect, wallet } = useAppSelector((state: RootState) => {
        return {
          connect: state.connect,
          wallet: state.wallet
        }
      });
    const dispatch: AppDispatch = useAppDispatch();

    const mainBox: SxProps = {
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        cursor: "pointer",
        background: "rgba(107,92,89,0.4)",
        "&:active": {
            background: "rgba(107,92,89,0.2)",
        },
    };

    const addressBox: SxProps = {
        flexGrow: 1,
        textAlign: "left",
        minWidth: "64px",
        p: "0 8px",
        fontWeight: 400,
        fontSize: "12px",
    };

    const iconStyle: SxProps = {
        display: "flex",
        justifyContent: "flex-start",
        height: "100%",
        background: connect.connected ? "green" : "whitesmoke",
    };

    const modalStyle: SxProps = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 280,
        bgcolor: "background.default",
        borderRadius: "8px",
    };

    const walletItemStyle: SxProps = {
        cursor: 'pointer',
        borderRadius: '8px',
        '&:hover': {
            background: 'rgba(93,93,93,0.4)'
        }
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleWalletClick = async (service: 'injected' | 'walletconnect') => {
        handleClose();
        await connectFunc(service);
    }
    const handleDisconnect = () => {
        handleClose();
        dispatch(reset({}));
    }

    return (
        <>
            <Box sx={mainBox} onClick={handleOpen}>
                <Box sx={iconStyle}>
                    <IconButton
                        size="small"
                        aria-label="wallet icon"
                        sx={{
                            color: connect.connected ? "green" : "whitesmoke",
                        }}
                    >
                        <AccountBalanceWalletOutlined
                            sx={{ color: connect.connected ? "white" : "red" }}
                        />
                    </IconButton>
                </Box>
                {connect.connected && (
                    <Box sx={addressBox}>
                        {connect.chainId === 1
                            ? connect.ens !== null
                                ? connect.ens
                                : `${connect.address.slice(
                                      0,
                                      5
                                  )}...${connect.address.slice(38)}`
                            : `Wrong network`}
                    </Box>
                )}
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                onBackdropClick={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                disableAutoFocus
                sx={{ border: "0px" }}
                aria-labelledby="wallet modal"
                aria-describedby="wallet modal"
            >
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <Box>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ textAlign: "center", p: "4px 12px", mt: "8px" }}
                            >
                                {connect.connected ? 'Wallet' : 'Connect'}
                            </Typography>
                        </Box>
                        {connect.connected ?
                        <Box>
                            <List sx={{ padding: '8px 12px', mb: '12px' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar alt="Ethereum" src={ethereum} />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <Typography variant="caption" component="div" fontSize={11}>
                                            {`${Number(wallet.ethBalance).toFixed(4)} ETH`}
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar alt="Saitanobi" src={saitanobi} />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <Typography variant="caption" component="div" fontSize={11}>
                                            {`${Math.floor(Number(wallet.saitanobiBalance)).toLocaleString('en-US')} SAITANOBI`}
                                        </Typography>    
                                    </ListItemText>
                                </ListItem>
                            </List>
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
                                onClick={handleClose}
                            />
                            <Chip
                                size="small"
                                color="primary"
                                label="Disconnect"
                                sx={{ minWidth: "84px", fontSize: "12px" }}
                                clickable
                                onClick={handleDisconnect}
                            />
                        </Box>
                        </Box>
                        :
                        <Box>
                            <List sx={{ padding: '8px 12px', mb: '12px' }}>
                                <ListItem sx={walletItemStyle} onClick={async () => await handleWalletClick('injected')}>
                                    <ListItemAvatar>
                                        <Avatar alt="Metamask" src={metamask} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2">
                                                        Browser Wallet
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '0.55rem', lineHeight: '4px' }}
                                                    variant="caption">
                                                        Metamask, Coinbase Wallet, others
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <ListItem sx={walletItemStyle} onClick={async () => await handleWalletClick('walletconnect')}>
                                    <ListItemAvatar>
                                        <Avatar alt="Walletconnect" src={walletconnect} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2">
                                                        Walletconnect
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '0.55rem', lineHeight: '4px' }}
                                                    variant="caption">
                                                        Mobile wallets, Wallet3, others
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </List>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Chip label="Close" color="primary" clickable onClick={handleClose} />
                            </Box>
                        </Box>
                        }
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default Wallet;
