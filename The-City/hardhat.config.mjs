import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

export default defineConfig({
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    }
  },
  paths: {
    artifacts: './frontend/src/artifacts',
  }
});