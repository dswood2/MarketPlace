import React from 'react';
import { EthProvider } from './EthContext';
import Marketplace from './components/Marketplace';

function App() {
  return (
    <EthProvider>
      <Marketplace />
    </EthProvider>
  );
}

export default App;