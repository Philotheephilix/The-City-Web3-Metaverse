import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}
const TodoDApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  // Contract ABI and address would be imported from deployment
  const contractABI = [/* ABI from compilation */];
  const contractAddress = "YOUR_CONTRACT_ADDRESS";

  useEffect(() => {
    const initializeEthereum = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          
          setAccount(accounts[0]);
          
          const signer = provider.getSigner();
          const todoContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          
          setContract(todoContract);
          await loadTasks(todoContract);
        }
      } catch (error) {
        console.error('Error initializing ethereum:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeEthereum();
  }, []);

  const loadTasks = async (todoContract) => {
    try {
      const tasks = await todoContract.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      setLoading(true);
      const tx = await contract.createTask(newTask);
      await tx.wait();
      
      await loadTasks(contract);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      setLoading(true);
      const tx = await contract.toggleTask(id);
      await tx.wait();
      
      await loadTasks(contract);
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      const tx = await contract.deleteTask(id);
      await tx.wait();
      
      await loadTasks(contract);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!window.ethereum) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <p className="text-center text-red-500">
            Please install MetaMask to use this application
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Decentralized Todo List</CardTitle>
        <p className="text-sm text-gray-500">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="flex-grow"
            disabled={loading}
          />
          <Button onClick={addTask} disabled={loading}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id.toString()} className="flex items-center justify-between p-2 border rounded">
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.content}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTask(task.id)}
                  disabled={loading}
                >
                  <CheckCircle className={`w-4 h-4 ${task.completed ? 'text-green-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoDApp;