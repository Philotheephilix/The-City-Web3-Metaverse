// scripts/deploy.mjs
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  try {
    // Get the contract factory
    const TodoList = await ethers.getContractFactory("TodoList");
    
    console.log("Deploying TodoList...");
    const todoList = await TodoList.deploy();
    await todoList.deployed();
    
    console.log("TodoList deployed to:", todoList.address);
    
    console.log("Waiting for block confirmations...");
    await todoList.deployTransaction.wait(6);
    
    // Verify the contract
    try {
      console.log("Verifying contract on Etherscan...");
      await pkg.run("verify:verify", {
        address: todoList.address,
        constructorArguments: [],
      });
    } catch (verifyError) {
      console.log("Verification failed:", verifyError.message);
    }
  } catch (error) {
    console.error("Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });