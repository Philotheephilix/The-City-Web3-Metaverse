// deploy.js
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    try {
        // Get deployer account
        const [deployer] = await ethers.getSigners();
        console.log("\nDeployment started...");
        console.log("--------------------------------");
        console.log("Deploying contracts with account:", deployer.address);
        
        // Check deployer balance
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("Account balance:", ethers.formatEther(balance), "ETH");
        
        // Deploy contract with error handling
        console.log("\nDeploying PYUSD contract...");
        const PYUSD = await ethers.getContractFactory("PYUSD");
        const pyusd = await PYUSD.deploy(deployer.address);
        
        // Wait for deployment with timeout
        const TIMEOUT = 5 * 60 * 1000; // 5 minutes
        const deploymentPromise = pyusd.waitForDeployment();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Deployment timeout")), TIMEOUT)
        );
        
        await Promise.race([deploymentPromise, timeoutPromise]);
        
        const address = await pyusd.getAddress();
        console.log("PYUSD deployed to:", address);
        
        // Verify deployment
        const code = await ethers.provider.getCode(address);
        if (code === "0x") {
            throw new Error("Contract deployment failed - no bytecode at address");
        }
        
        // Mint tokens with confirmation
        console.log("\nMinting initial supply...");
        const mintAmount = ethers.parseUnits("100000", 6); // 100,000 PYUSD
        const mintTx = await pyusd.mint(deployer.address, mintAmount);
        console.log("Mint transaction hash:", mintTx.hash);
        
        // Wait for mint confirmation
        const receipt = await mintTx.wait();
        if (receipt.status === 0) {
            throw new Error("Mint transaction failed");
        }
        console.log(`Minted 100,000 PYUSD to ${deployer.address}`);
        
        // Verify final balance
        const tokenBalance = await pyusd.balanceOf(deployer.address);
        console.log("\nDeployment Summary:");
        console.log("--------------------------------");
        console.log({
            network: (await ethers.provider.getNetwork()).name,
            token: address,
            deployer: deployer.address,
            balance: ethers.formatUnits(tokenBalance, 6),
            mintTxHash: mintTx.hash
        });
        
        // Write deployment info to file for verification
        const fs = await import('fs');
        const deploymentInfo = {
            network: (await ethers.provider.getNetwork()).name,
            token: address,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            txHash: pyusd.deploymentTransaction().hash
        };
        
        fs.writeFileSync(
            'deployment-info.json',
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log("\nDeployment info saved to deployment-info.json");
        console.log("--------------------------------");
        
    } catch (error) {
        console.error("\nDeployment failed:");
        console.error("--------------------------------");
        console.error(error);
        
        // Log additional error details if available
        if (error.transaction) {
            console.error("\nTransaction that failed:");
            console.error(error.transaction);
        }
        if (error.receipt) {
            console.error("\nTransaction receipt:");
            console.error(error.receipt);
        }
        
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });