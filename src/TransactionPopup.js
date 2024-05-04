import React from 'react';

const TransactionPopup = ({ transactionHash, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(transactionHash);
  };

  return (
    <div className="transaction-popup">
      <div className="transaction-popup-content">
        <h3>Transaction Hash:</h3>
        <p>{transactionHash}</p>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TransactionPopup;