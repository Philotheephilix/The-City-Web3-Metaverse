// First, install required types:
// npm install --save-dev @types/node @types/react @types/react-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
interface PYUSDTransferProps {
  initialReceiverAddress?: string;
  initialAmount?: string;
}
  
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
  
  // PYUSDTransfer.tsx
  import React, { useState, useEffect } from 'react';
  import { ethers } from 'ethers';
  import detectEthereumProvider from '@metamask/detect-provider';
  import PYUSD_ABI from '../../../artifacts/contracts/PyUsd.sol/PYUSD.json';
  
  declare global {
    interface Window {
      ethereum?: MetaMaskEthereumProvider;
    }
  }
  
  interface TransferStatus {
    message: string;
    type: 'info' | 'success' | 'error';
  }
  
  const PYUSDTransfer: React.FC<PYUSDTransferProps> = ({ initialReceiverAddress, initialAmount }) => {
    const [account, setAccount] = useState<string>('');
    const [amount, setAmount] = useState<string>(initialAmount || '');
    const [balance, setBalance] = useState<string>('0');
    const [receiverAddress, setReceiverAddress] = useState<string>(initialReceiverAddress || '');
    const [status, setStatus] = useState<TransferStatus | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
  
    const PYUSD_CONTRACT_ADDRESS = '0xf290590D47c81820427A108Ce6363607a03Aaf1b';
    console.log(initialAmount,initialReceiverAddress)
    useEffect(() => {
      checkIfWalletIsConnected();
    }, []);
  
    useEffect(() => {
      if (isConnected && account) {
        updateBalance();
      }
    }, [isConnected, account]);
  
    const checkIfWalletIsConnected = async (): Promise<void> => {
      try {
        const provider = await detectEthereumProvider();
        
        if (provider && window.ethereum) {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          }) as string[];
  
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } else {
          setStatus({
            message: 'Please install MetaMask!',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setStatus({
          message: 'Error checking wallet connection',
          type: 'error'
        });
      }
    };
  
    const updateBalance = async (): Promise<void> => {
      try {
        if (!window.ethereum) return;
  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const pyusdContract = new ethers.Contract(
          PYUSD_CONTRACT_ADDRESS,
          PYUSD_ABI.abi,
          provider
        );
        
        const balance = await pyusdContract.balanceOf(account);
        setBalance(ethers.formatUnits(balance, 6));
      } catch (error) {
        console.error('Error fetching balance:', error);
        setStatus({
          message: 'Error fetching balance',
          type: 'error'
        });
      }
    };
  
    const connectWallet = async (): Promise<void> => {
      try {
        const provider = await detectEthereumProvider();
        
        if (provider && window.ethereum) {
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          }) as string[];
  
          setAccount(accounts[0]);
          setIsConnected(true);
          setStatus({
            message: 'Wallet connected!',
            type: 'success'
          });
        } else {
          setStatus({
            message: 'Please install MetaMask!',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setStatus({
          message: 'Error connecting wallet',
          type: 'error'
        });
      }
    };
  
    const sendPYUSD = async (): Promise<void> => {
      try {
        if (!window.ethereum) {
          setStatus({
            message: 'MetaMask is not installed',
            type: 'error'
          });
          return;
        }
  
        if (!ethers.isAddress(receiverAddress)) {
          setStatus({
            message: 'Invalid receiver address',
            type: 'error'
          });
          return;
        }
  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const pyusdContract = new ethers.Contract(
          PYUSD_CONTRACT_ADDRESS,
          PYUSD_ABI.abi,
          signer
        );
  
        const amountInWei = ethers.parseUnits(amount, 6);
  
        setStatus({
          message: 'Initiating transfer...',
          type: 'info'
        });
  
        const tx = await pyusdContract.transfer(receiverAddress, amountInWei);
        
        setStatus({
          message: 'Transaction submitted. Waiting for confirmation...',
          type: 'info'
        });
        
        await tx.wait();
        
        setStatus({
          message: 'Transfer successful!',
          type: 'success'
        });
        
        // Update balance and clear form
        updateBalance();
        setAmount('');
        setReceiverAddress('');
      } catch (error) {
        console.error('Error sending PYUSD:', error);
        setStatus({
          message: `Error sending PYUSD: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error'
        });
      }
    };
  
    const getStatusClassName = (type: TransferStatus['type']): string => {
      switch (type) {
        case 'success':
          return 'bg-green-100 text-green-800';
        case 'error':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-slate-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">PYUSD Transfer</h1>
        
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white">Connected Account:</p>
              <p className="font-mono text-slate-400 text-sm">{account}</p>
            </div>
            
            <div>
              <p className="text-sm text-white">PYUSD Balance:</p>
              <p className="font-mono text-slate-400 text-sm">{balance} PYUSD</p>
            </div>
            
            {!initialAmount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (PYUSD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        )}
        
        {!initialReceiverAddress && (
          <div>
            <label className="block text-sm font-medium text-white">
              Receiver Address
            </label>
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0x..."
            />
          </div>
        )}
            
            <button
              onClick={sendPYUSD}
              className="w-full bg-blue-500 gap-2 flex flex-row align-center justify-center text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={faPaypal} size="2x" />
              Send PYUSD
            </button>
          </div>
        )}
        
        {status && (
          <div className={`mt-4 p-3 rounded ${getStatusClassName(status.type)}`}>
            <p className="text-sm">{status.message}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default PYUSDTransfer;