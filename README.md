# Color Marketplace

The Color Marketplace is a decentralized application (DApp) built on the Ethereum blockchain that allows users to mine, buy, and sell unique colors. Each color is represented as an NFT (Non-Fungible Token) and can be owned, priced, and traded by users.

## Features

- Mine new colors as NFTs with a specified price
- Buy colors from other users
- Set the price of owned colors
- Toggle the sale status of owned colors
- View a list of available colors with their token IDs, prices, and sale statuses
- Pagination support to navigate through the list of colors
- Wallet connection using MetaMask for secure transactions

## Technologies Used

- React.js: Front-end JavaScript library for building user interfaces
- Solidity: Programming language for writing smart contracts on the Ethereum blockchain
- Web3.js: JavaScript library for interacting with the Ethereum blockchain
- Ethereum: Decentralized platform for building and deploying smart contracts
- MetaMask: Browser extension for managing Ethereum wallets and interacting with DApps

## Getting Started

To run the Color Marketplace locally, follow these steps:

1. Clone the repository:
   
   - git clone https://github.com/dswood2/MarketPlace.git
     
3. Install the dependencies:
   
   - cd MarketPlace
   - npm install
     
5. Configure the Ethereum network:

   - Make sure you have MetaMask installed in your browser.
   - Connect MetaMask to the desired Ethereum network (e.g., Sepolia testnet).

4. Start the development server:

   - npm start

5. Open the application in your browser:

   - http://localhost:3000

## Smart Contract

The Color Marketplace smart contract is written in Solidity and provides the following functionalities:

- Minting new colors as NFTs
- Buying colors from other users
- Setting the price of owned colors
- Toggling the sale status of owned colors
- Retrieving color details by token ID

The smart contract is deployed on the Ethereum blockchain and interacts with the front-end application through Web3.js.

## Contributing

Contributions to the Color Marketplace project are welcome! If you find any bugs, have suggestions for improvements, or want to add new features, please open an issue or submit a pull request.

