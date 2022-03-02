import { AppBar, Box, Toolbar, SxProps } from "@mui/material";
import * as React from "react";
import Wallet from "./Wallet";
import saitanobi from "../../assets/images/stakingden.png";

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
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img src={saitanobi} alt="saitanobi" height="36px" />
                </div>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Wallet connectFunc={connectFunc} />
                </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navigation;