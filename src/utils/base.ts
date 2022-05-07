import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers, Signer} from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";

export let web3: JsonRpcProvider | Web3Provider = new ethers.providers.JsonRpcProvider(`${process.env.REACT_APP_ETH_RPC}`);
export let signer: Signer;

export const setProvider = async (service: 'injected' | 'walletconnect') => {
    try {
        if (service === 'injected') {
            const provider: any = await detectEthereumProvider();
            if (provider) {
                await provider.request({ method: 'eth_requestAccounts' });
                web3 = new ethers.providers.Web3Provider(provider);
                signer = web3.getSigner();
                localStorage.setItem('walletprovider', service);
            } else {
                alert('Install a web3 browser wallet.');
            }
        }
        else if (service === 'walletconnect') {
            const provider: WalletConnectProvider = new WalletConnectProvider({
                rpc: {
                    1: `${process.env.REACT_APP_ETH_RPC}`
                }
            });

            await provider.enable();
            web3 = new ethers.providers.Web3Provider(provider);
            signer = web3.getSigner();
            localStorage.setItem('walletprovider', service);
        }
    }
    catch(e) {
        console.log(e);
    }
}