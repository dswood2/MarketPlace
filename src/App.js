import React, { useState, useEffect } from 'react';
import { mintNFT, buyNFT, setNFTPrice, toggleNFTSale, getNFTItem } from './MarketplaceContractNFT';
import Web3 from 'web3';
import './App.css';
import TransactionPopup from './TransactionPopup';

const web3 = new Web3(window.ethereum);

function App() {
  const [nftItems, setNFTItems] = useState([]);
  const [mintPrice, setMintPrice] = useState('');
  const [buyTokenId, setBuyTokenId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [toggleSaleTokenId, setToggleSaleTokenId] = useState('');
  const [setPriceTokenId, setSetPriceTokenId] = useState('');
  const [activeSection, setActiveSection] = useState('mint');
  const [currentPage, setCurrentPage] = useState(1);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const itemsPerPage = 9;

  // Fetch NFT items on component mount
  useEffect(() => {
    fetchNFTItems();
  }, []);

  // Function to fetch NFT items from the smart contract
  const fetchNFTItems = async () => {
    try {
      const items = [];
      let i = 1;
      let item = await getNFTItem(i);
      while (item.owner !== '0x0000000000000000000000000000000000000000') {
        items.push(item);
        i++;
        item = await getNFTItem(i);
      }
      setNFTItems(items);
    } catch (error) {
      console.error('Error fetching NFT items:', error);
    }
  };

  // Function to connect the user's wallet
  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setConnectedAccount(accounts[0]);
      setShowConnectModal(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Function to handle different actions based on the selected section
  const handleAction = (action) => {
    if (!connectedAccount) {
      setShowConnectModal(true);
      return;
    }
    switch (action) {
      case 'mint':
        handleMintNFT();
        break;
      case 'buy':
        handleBuyNFT();
        break;
      case 'setPrice':
        handleSetNFTPrice();
        break;
      case 'toggleSale':
        handleToggleNFTSale();
        break;
      default:
        break;
    }
  };

  // Function to handle minting a new NFT
  const handleMintNFT = async () => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      const priceInWei = web3.utils.toWei(mintPrice, 'ether');
      const result = await mintNFT(priceInWei);
      const transactionHash = result.transactionHash;
      setTransactionHash(transactionHash);
      setShowTransactionPopup(true);
      fetchNFTItems();
      setMintPrice('');
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  // Function to handle buying an NFT
  const handleBuyNFT = async () => {
    if (!connectedAccount) {
      setShowConnectModal(true);
      return;
    }
    try {
      const item = await getNFTItem(buyTokenId);
      if (!item.forSale) {
        alert('This item is not for sale.');
        return;
      }
      const result = await buyNFT(buyTokenId, item.price);
      const transactionHash = result.transactionHash;
      setTransactionHash(transactionHash);
      setShowTransactionPopup(true);
      fetchNFTItems();
      setBuyTokenId('');
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };
  
  // Function to handle setting the price of an NFT
  const handleSetNFTPrice = async () => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      const item = await getNFTItem(setPriceTokenId);
      if (item.owner.toLowerCase() !== connectedAccount.toLowerCase()) {
        alert('You can only set the price for items you own.');
        return;
      }
      const priceInWei = web3.utils.toWei(newPrice, 'ether');
      const result = await setNFTPrice(setPriceTokenId, priceInWei);
      const transactionHash = result.transactionHash;
      setTransactionHash(transactionHash);
      setShowTransactionPopup(true);
      fetchNFTItems();
      setSetPriceTokenId('');
      setNewPrice('');
    } catch (error) {
      console.error('Error setting NFT price:', error);
    }
  };
  
  // Function to handle toggling the sale status of an NFT
  const handleToggleNFTSale = async () => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }
    try {
      const item = await getNFTItem(toggleSaleTokenId);
      if (item.owner.toLowerCase() !== connectedAccount.toLowerCase()) {
        alert('You can only toggle the sale status for items you own.');
        return;
      }
      const result = await toggleNFTSale(toggleSaleTokenId);
      const transactionHash = result.transactionHash;
      setTransactionHash(transactionHash);
      setShowTransactionPopup(true);
      fetchNFTItems();
      setToggleSaleTokenId('');
    } catch (error) {
      console.error('Error toggling NFT sale:', error);
    }
  };
  
  // Function to generate a random color for NFT items
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Pagination variables
  const totalPages = Math.ceil(nftItems.length / itemsPerPage);

  // Function to handle going to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle going to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to get the paginated NFT items for the current page
  const getPaginatedItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return nftItems.slice(startIndex, endIndex);
  };

  // Render the UI
  return (
    <div className="app">
      <header className="app-header">
        <h1>Color Marketplace</h1>
        <nav className="app-nav">
          <button
            className={`nav-button ${activeSection === 'mint' ? 'active' : ''}`}
            onClick={() => setActiveSection('mint')}
          >
            Mine Color
          </button>
          <button
            className={`nav-button ${activeSection === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveSection('buy')}
          >
            Buy Color
          </button>
          <button
            className={`nav-button ${activeSection === 'price' ? 'active' : ''}`}
            onClick={() => setActiveSection('price')}
          >
            Set Price
          </button>
          <button
            className={`nav-button ${activeSection === 'sale' ? 'active' : ''}`}
            onClick={() => setActiveSection('sale')}
          >
            Toggle Sale
          </button>
        </nav>
      </header>
      <main className="app-main">
        {activeSection === 'mint' && (
          <section className="mint-section">
            <h2>Mine Color</h2>
            <div className="form-group">
              <input
                type="number"
                value={mintPrice}
                onChange={(e) => setMintPrice(e.target.value)}
                placeholder="Enter price"
                className="input-field"
              />
              <button onClick={() => handleAction('mint')} className="button">Mine Color</button>
            </div>
          </section>
        )}
        {activeSection === 'buy' && (
          <section className="buy-section">
            <h2>Buy Color</h2>
            <div className="form-group">
              <input
                type="number"
                value={buyTokenId}
                onChange={(e) => setBuyTokenId(e.target.value)}
                placeholder="Enter token ID"
                className="input-field"
              />
              <button onClick={() => handleAction('buy')} className="button">Buy Color</button>
            </div>
          </section>
        )}
        {activeSection === 'price' && (
          <section className="set-price-section">
            <h2>Set Color Price</h2>
            <div className="form-group">
              <input
                type="number"
                value={setPriceTokenId}
                onChange={(e) => setSetPriceTokenId(e.target.value)}
                placeholder="Enter token ID"
                className="input-field"
              />
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter new price"
                className="input-field"
              />
              <button onClick={() => handleAction('setPrice')} className="button">Set Color Price</button>
            </div>
          </section>
        )}
        {activeSection === 'sale' && (
          <section className="toggle-sale-section">
            <h2>Toggle Color Sale</h2>
            <div className="form-group">
              <input
                type="number"
                value={toggleSaleTokenId}
                onChange={(e) => setToggleSaleTokenId(e.target.value)}
                placeholder="Enter token ID"
                className="input-field"
              />
              <button onClick={() => handleAction('toggleSale')} className="button">Toggle Color Sale</button>
            </div>
          </section>
        )}
        {showConnectModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Connect Wallet</h2>
            <p>Please connect your wallet to continue.</p>
            <div className="modal-buttons">
              <button onClick={connectWallet}>Connect</button>
              <button onClick={() => setShowConnectModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
        <section className="color-list-section">
          <h2>Colors</h2>
          <ul className="color-list">
            {getPaginatedItems().map((item) => (
              <li key={item.tokenId} className="color-item" style={{ backgroundColor: getRandomColor() }}>
                <div className="color-item-content">
                  <h3>Token ID: {item.tokenId.toString()}</h3>
                  <p>Price: {web3.utils.fromWei(item.price.toString(), 'ether')} ETH</p>
                  <p>For Sale: {item.forSale.toString()}</p>
                </div>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </section>
      </main>
      {showTransactionPopup && (
        <TransactionPopup
          transactionHash={transactionHash}
          onClose={() => setShowTransactionPopup(false)}
        />
      )}
    </div>
  );
}

export default App;