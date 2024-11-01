import pkg from 'hardhat';
const { ethers } = pkg;
async function main() {
  try {
      const [deployer] = await ethers.getSigners();
      console.log("Deploying contracts with account:", deployer.address);

      // Deploy contract
      const PYUSD = await ethers.getContractFactory("PYUSD");
      const pyusd = await PYUSD.deploy(deployer.address);
      await pyusd.waitForDeployment();

      const address = await pyusd.getAddress();
      console.log("PYUSD deployed to:", address);

      // Mint tokens to deployer
      const mintAmount = ethers.parseUnits("100000", 6); // 1000 PYUSD
      const mintTx = await pyusd.mint(deployer.address, mintAmount);
      await mintTx.wait();
      console.log(`Minted 1000 PYUSD to ${deployer.address}`);

      // Verify balance
      const balance = await pyusd.balanceOf(deployer.address);
      console.log(`PYUSD Balance: ${ethers.formatUnits(balance, 6)}`);
      
      console.log({
          token: address,
          deployer: deployer.address,
          balance: ethers.formatUnits(balance, 6)
      });
  } catch (error) {
      console.error("Deployment failed:", error);
      throw error;
  }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });