import * as React from "react";
import './App.scss';
import { setProvider, signer, web3 } from "./utils/base";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { RootState } from "./store";
import { changeAccount, makeConnection, reset } from "./state/connect/connect";
import detectEthereumProvider from "@metamask/detect-provider";
import Navigation from "./components/Nav/Navigation";
import { Box } from "@mui/system";
import StakingCard from "./components/Stake/StakingCard";
import { CssBaseline, ThemeProvider, createTheme, Fab, Typography, Snackbar, Alert } from "@mui/material";
import { CurrencyExchangeOutlined } from "@mui/icons-material";
import { getBalances } from "./state/wallet/wallet";
import { getStake } from "./state/stake/stake";

const uniswapLink = 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x5e9f35e8163c44cd7e606bdd716abed32ad2f1c6&use=v2&chain=mainnet';

interface ICurrentTx {
  hash: string;
  status: 'fulfilled' | 'failed' | 'pending' | 'standby';
}

const App: React.FC = (): React.ReactElement => {
  const [currentTx, setCurrentTx] = React.useState<ICurrentTx | null>(null);
  const [severity, setSeverity] = React.useState<'success' | 'error' | 'warning' | 'info'>('info');
  const dispatch = useAppDispatch();
  const { connect, tx } = useAppSelector((state: RootState) => {
    return {
      connect: state.connect,
      tx: state.tx
    }
  });

  React.useEffect(() => {
    setCurrentTx(tx.hashes.at(-1) || null);
    if (currentTx !== null) {
      setSeverity(selectSeverity(currentTx.status));
    }
    setTimeout(() => {
      setCurrentTx(null);
      setSeverity('info');
    }, 5000);
    
  }, [tx]);

  function selectSeverity(val: string): 'success' | 'error' | 'info' {
    if (val === 'fulfilled') {
      return 'success'
    } else if (val === 'failed') {
      return 'error'
    } else {
      return 'info'
    }
  }

  const theme = createTheme({
    typography: {
      fontFamily: [
        '"Inter"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(','),
      fontWeightRegular: 600,
      fontWeightLight: 500,
      fontWeightBold: 700
    },
    palette: {
      primary: {
        main: '#FF0000',
        light: '#ff5a36',
        dark: '#c20000'
      },
      secondary: {
        main: '#656565',
        light: '#939393',
        dark: '#3b3b3b'
      },
      warning: {
        main: '#F25B63'
      },
      background: {
        default: '#000000',
        paper: 'rgba(93,93,93,0.5)'
      },
      text: {
        primary: '#D0D3D4',
        secondary: '#D0D3D4',
        disabled: '#909497'
      }
    },
  })

  const connectWallet = React.useCallback(async (service: 'injected' | 'walletconnect'): Promise<void> => {
    try {
      await setProvider(service);
      const address: string = await signer.getAddress();
      const chainId: number = await signer.getChainId();
      const ens: string | null = await web3.lookupAddress(address).catch(() => null) ?? null;
      dispatch(makeConnection({
        connected: true,
        address,
        chainId,
        ens
      }));
      dispatch(await getBalances());
      dispatch(await getStake());
    }
    catch(e) {
      console.log(e);
    }
  }, [dispatch]);

  const subscribe = React.useCallback(async (): Promise<void> => {
    const provider: any = await detectEthereumProvider();
    if (provider) {
      provider.on('accountsChanged', async (accounts: string[]) => {
        if (accounts === null || accounts.length === 0) {
          dispatch(reset({}));
        } else {
          let ens: string | null = null;
          if (web3) {
            ens = await web3.lookupAddress(accounts[0]);
          }
          dispatch(changeAccount({
            address: accounts[0],
            ens
          }));
          console.log(`Account changed to ${accounts[0]}`)
        }
      });

      provider.on('disconnect', async () => {
        console.log('Disconnected');
        dispatch(reset({}));
      });

      provider.on('chainChanged', async (chainId: number) => {
        console.log(`Chain changed to ${chainId}`);
        window.location.reload();
      });
    }
  }, [dispatch]);

  React.useEffect(() => {
    const walletprovider: string | null = localStorage.getItem('walletprovider');
    if (walletprovider === 'injected' || walletprovider === 'walletconnect') {
      Promise.resolve(connectWallet(walletprovider));
    } else {
      Promise.resolve(dispatch(getStake()));
    }
  }, [connectWallet]);

  React.useEffect(() => {
    if (connect.connected) {
      Promise.resolve(subscribe());
    }
  }, [connect.connected, subscribe]);

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation connectFunc={connectWallet} />
      <Box className="mainApp">
        <StakingCard />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Fab variant="extended" color="primary" aria-label="buy" onClick={() => window.open(uniswapLink, '_blank noreferrer')}>
          <CurrencyExchangeOutlined sx={{ mr: 1 }} />
          <Typography variant="body1" component="div">
            Buy Saitanobi
          </Typography>
        </Fab>
      </Box>
      <Snackbar
        open={currentTx !== null}
        onClose={() => setCurrentTx(null)}
        sx={{ cursor: 'pointer', fontSize: '8px' }}
      >
        <Alert
          onClick={() => window.open(`https://etherscan.io/tx/${currentTx?.hash}`, `_blank noreferrer`)}
          onClose={() => setCurrentTx(null)}
          severity={severity}>
          {`Tx sent: ${currentTx?.hash}`}
        </Alert>
      </Snackbar>
    </ThemeProvider>
    </>
  );
}

export default App;
