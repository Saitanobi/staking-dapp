import { AppBar, Toolbar, Typography, SxProps } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import Wallet from "./Wallet";
import saitanobi from "../../assets/images/saitanobi.svg";

interface INavigationProps {
    connectFunc: Function;
}

const Navigation: React.FC<INavigationProps> = ({ connectFunc }) => {

    const appBarStyle: SxProps = {
        width: 'calc(100% - 8vw)',
        color: 'white',
        background: 'rgba(93, 93, 93, 0.4)',
        backdropFilter: 'blur(4px)',
        margin: '12px 4vw',
        borderRadius: '8px'
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar sx={appBarStyle}>
                <Toolbar variant="dense">
                <Typography variant="h5" component="div">
                    <img src={saitanobi} alt="saitanobi" height="12px" />
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Wallet connectFunc={connectFunc} />
                </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navigation;