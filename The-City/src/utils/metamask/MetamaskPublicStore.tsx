import { useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import MetamaskLogo from '../../assets/MetaMask_Fox.png'

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
  on(event: string, listener: (...args: any[]) => void): void;
  removeListener(event: string, listener: (...args: any[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: MetaMaskEthereumProvider;
  }
}

const MetaMaskButton = () => {
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connectWallet = async (): Promise<void> => {
    setIsConnecting(true);
    try {
      const provider = await detectEthereumProvider();

      if (provider && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        }) as string[];

        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('eth-add', accounts[0]); 
      } 
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 border border-2 border-slate-900 rounded-lg hover:border-slate-400">
      <button
        onClick={connectWallet}
        disabled={isConnecting || isConnected}
        className={`
          flex items-center gap-2 px-2 py-2 
          rounded-lg font-medium text-lg
          transition-all duration-200
          ${isConnected 
            ? 'bg-black text-white hover:bg-gray-800' 
            : 'bg-black text-black hover:bg-slate-900'
          }
          disabled:opacity-70 disabled:cursor-not-allowed
        `}
      >
        <img className='h-8 ' src={MetamaskLogo} alt="" />

        <span className='text-white'>
          {isConnecting ? 'Connecting...' : 
           isConnected ? `Connected: ${account.slice(0,6)}...${account.slice(-4)}` : 
           'Connect MetaMask'}
        </span>
      </button>
    </div>
  );
};

export default MetaMaskButton;