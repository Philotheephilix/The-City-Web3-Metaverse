// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        uint id;
        string content;
        bool completed;
        uint timestamp;
    }
    
    mapping(address => Task[]) private userTasks;
    mapping(address => uint) private taskCount;
    
    event TaskCreated(address indexed user, uint id, string content, uint timestamp);
    event TaskCompleted(address indexed user, uint id);
    event TaskDeleted(address indexed user, uint id);
    
    function createTask(string memory _content) public {
        uint taskId = taskCount[msg.sender];
        userTasks[msg.sender].push(Task(taskId, _content, false, block.timestamp));
        taskCount[msg.sender]++;
        
        emit TaskCreated(msg.sender, taskId, _content, block.timestamp);
    }
    
    function toggleTask(uint _id) public {
        require(_id < taskCount[msg.sender], "Task does not exist");
        userTasks[msg.sender][_id].completed = !userTasks[msg.sender][_id].completed;
        
        emit TaskCompleted(msg.sender, _id);
    }
    
    function deleteTask(uint _id) public {
        require(_id < taskCount[msg.sender], "Task does not exist");
        
        // Move the last element to the deleted position
        userTasks[msg.sender][_id] = userTasks[msg.sender][userTasks[msg.sender].length - 1];
        userTasks[msg.sender].pop();
        taskCount[msg.sender]--;
        
        emit TaskDeleted(msg.sender, _id);
    }
    
    function getTasks() public view returns (Task[] memory) {
        return userTasks[msg.sender];
    }
    
    function getTaskCount() public view returns (uint) {
        return taskCount[msg.sender];
    }
}