# Thoonga Nagaram - The City
A decentralized and transparent platform for enhancing government transparency and citizen engagement through privacy-focused blockchain technology.

---
### DEPLOYMENT MAYBE RANDOMLY LOSE DATABASE CONNECTIVITY REFRESH THE PAGE (15-20pages), IF DATA IS MISSING 

## 📖 Project Overview
**Thoonga Nagaram** is a pioneering platform designed to facilitate transparency in government actions and enable privacy-centric, decentralized citizen data management. By leveraging zero-knowledge (ZK) technology and anonymous protocols, Thoonga Nagaram allows citizens to manage grievances, monitor government expenditures, and interact with services without compromising privacy.

---

## 🔍 Problem Statement & Solutions
Thoonga Nagaram aims to address several pressing issues in government transparency and citizen engagement:
- **Transparency in Government Actions and Spending:** Citizens gain full visibility into government expenditures, including transaction hashes for all departmental spending.
- **Bribe-Free Society:** A transparent financial structure minimizes corruption.
- **Unified Payment Platform:** Users can pay taxes, utility bills, medical expenses, and more, all through a single portal using PYUSD-based blockchain transactions.
- **Anonymous Feedback & Grievance Submission:** Citizens can submit grievances and monitor crime rates and energy usage anonymously, ensuring personal security.
- **Financial Management:** Users can track their transaction history and analyze their spending habits for improved budgeting.
- **Educational Portal:** Users can access resources on blockchain technology, market insights, and trends for better financial literacy.
- **Privacy in Healthcare:** Hospitals can access a citizen’s medical history without revealing personal identifiers using ZK protocols.

---

## 💡 Key Features
- **Transparent Government Expenditures:** Public access to transaction data of law enforcement, Public Works, and other government departments.
- **Anonymous Grievance Submission:** Zero-knowledge-based systems ensure feedback remains anonymous.
- **One-Stop Financial Hub:** Pay taxes, bills, and more using PYUSD, fostering a more unified digital economy.
- **Personalized Financial Analytics:** View and manage transaction history.
- **Medical History Management:** Hospitals can securely access medical records using Anon Aadhaar without disclosing identity.
- **Blockchain-Based Educational Resources:** Stay informed about various chains and market trends.
- **Region-Specific Features for India:** Uses Anon Aadhaar for anonymous user authentication, focusing on Indian governance needs.

---

## 🚧 Challenges Faced
- **Gas Fees for On-Chain Storage:** High gas fees posed a challenge in making the platform affordable. To address this, we optimized the platform's interaction with on-chain storage, selectively storing essential data on-chain to reduce costs.

---

## 🛠️ Technologies Used
- **Blockchain & Smart Contracts:** Solidity, EVM, Hardhat, ethers.js
- **Frontend:** TypeScript, React.js, Vite.js
- **Backend & Database:** Express.js, MongoDB Atlas, IPFS
- **Additional Tools & Integrations:** QuickNode (Functions, Streams, Gas Fees API), Covalent Gold Rush, Blockscout, CoinAPI

## DISCLAIMER: Deployed site in on VERCEL which lacks mongodb connectivity so site may loose backend conectivity initially Refreshing the site 10-15 times will revive the server 

## Installation
Clone the repo to local by running
```bash
git clone https://github.com/Philotheephilix/The-City-Web3-Metaverse
```
### Frontend
- Run  
```bash
cd The-City
```
- Install all Depedencies and start development environment
```bash
bun install && bun run dev
```
### Backend
Install mongoDb on System and create a database named thoonga_nagaram and create collections and add sample data from /server/jsons/
- Install all dependencies and start server
```bash
bun install && bun start
```
### Configuration
- Change backend url to expressjs deployed above in constants.tsx file in /The-City/src/constants.tsx

## 🔗 Links
- **Live Demo:** [The City Web3 Metaverse](https://the-city-web3-metaverse.vercel.app/)
- **Etherscan Token Link:** [Sepolia Etherscan](https://sepolia.etherscan.io/token/0xf290590D47c81820427A108Ce6363607a03Aaf1b)
- **Video Demo:** [YouTube Video](https://www.youtube.com/watch?v=t7m0tafD6p0&t=1s)

---

## 🏆 Applicable Tracks

- **PYUSD:** Greater Good Award, BUIDL with PYUSD (🥇, 🥈, 🥉)
- **Noves:** Best use of Noves Translate API
- **QuickNode:** Best Overall Project, Best use of Streams, Best use of Marketplace Addons, Best use of Functions
- **Covalent:** Best use of Covalent GoldRush Add-ons
- **Blockscout:** Top two best use of Blockscout Add-ons
- **CoinAPI:** Best use of Crypto Market Data Add-on

---

## 📝 Track Descriptions
### Noves Translate API
- **Functionality:** Enables tracking and analyzing transaction histories.
- **Usage:** Provides users with analytics based on historical transaction data.

### PYUSD: Greater Good Award
- **Focus:** Supports a stable, bribe-free digital economy using PYUSD.
- **Benefits:** Mitigates inflation and fosters economic stability.

### Covalent GoldRush Add-ons
- **Purpose:** Enhances transparency in government financial transactions.
- **Usage:** Provides a visual and data-driven analysis of government expenses, contributing to accountability and reducing corruption.

### QuickNode Streams & Functions
- **Streams:** Public grievances are managed in real time.
- **Functions:** Customized for storing and retrieving feedback securely, ensuring immutability and integrity.

### Blockscout Add-ons
- **Purpose:** Provides analytics and visual demonstrations for educational purposes.
- **Outcome:** Supports citizen learning on crypto usage and analytics within the platform.

### CoinAPI: Best use of Crypto Market Data Add-on
- **Functionality:** Visualizes current crypto market data for user education.
- **Outcome:** Offers users price movements, order book visualizations, and recent quotes on specific chains.

---

**Thoonga Nagaram** strives to be a beacon of transparency, privacy, and citizen empowerment for India’s digital future. We aim to foster trust and engagement between the government and its citizens through secure, decentralized technology.
