import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// TodoList Contract ABI (based on the provided Solidity contract)
const TODO_LIST_ABI = [
  "function createTask(string memory _content) public",
  "function toggleTask(uint _id) public",
  "function deleteTask(uint _id) public",
  "function getTasks() public view returns (tuple(uint id, string content, bool completed, uint timestamp)[])",
  "function getTaskCount() public view returns (uint)",
  "event TaskCreated(address indexed user, uint id, string content, uint timestamp)",
  "event TaskCompleted(address indexed user, uint id)",
  "event TaskDeleted(address indexed user, uint id)"
];

// Replace with your deployed contract address
const TODO_LIST_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

const TodoListApp: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState('');

  // Connect to MetaMask and create contract instance
  const connectWallet = async () => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Get connected account
      const address = await signer.getAddress();
      setAccount(address);

      // Create contract instance
      const todoListContract = new ethers.Contract(
        TODO_LIST_ADDRESS, 
        TODO_LIST_ABI, 
        signer
      );
      setContract(todoListContract);

      // Fetch existing tasks
      await fetchTasks();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Fetch tasks from the contract
  const fetchTasks = async () => {
    if (!contract) return;
    
    try {
      const fetchedTasks = await contract.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Create a new task
  const createTask = async () => {
    if (!contract || !newTaskContent.trim()) return;

    try {
      const tx = await contract.createTask(newTaskContent);
      await tx.wait();
      
      // Reset input and refresh tasks
      setNewTaskContent('');
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId: number) => {
    if (!contract) return;

    try {
      const tx = await contract.toggleTask(taskId);
      await tx.wait();
      
      await fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: number) => {
    if (!contract) return;

    try {
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Listen for network changes
  useEffect(() => {
    const handleNetworkChange = () => {
      connectWallet();
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleNetworkChange);
      window.ethereum.on('accountsChanged', handleNetworkChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleNetworkChange);
        window.ethereum.removeListener('accountsChanged', handleNetworkChange);
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ethereum Todo List</h1>
      
      {!account ? (
        <button 
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="flex mb-4">
            <input 
              type="text"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Enter new task"
              className="flex-grow border p-2 mr-2"
            />
            <button 
              onClick={createTask}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Task
            </button>
          </div>

          <div>
            {tasks.map((task, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between border-b py-2"
              >
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mr-2"
                  />
                  <span 
                    className={`${task.completed ? 'line-through text-gray-500' : ''}`}
                  >
                    {task.content}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoListApp;

// Note: This component requires:
// 1. ethers.js v6
// 2. A deployed TodoList contract
// 3. MetaMask or similar Web3 wallet
// 4. Tailwind CSS for styling (can be replaced with custom CSS)