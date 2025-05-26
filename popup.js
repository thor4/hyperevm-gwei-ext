// Placeholder for the HyperEVM RPC URL
const RPC_URL = 'https://rpc.hyperliquid.xyz/evm'; // Replace with actual HyperEVM RPC URL
const GWEI_CONVERSION_FACTOR = 1_000_000_000;

document.addEventListener('DOMContentLoaded', () => {
  fetchGasPrice();
  
  const refreshButton = document.getElementById('refreshButton');
  if (refreshButton) {
    refreshButton.addEventListener('click', fetchGasPrice);
  }
});

async function fetchGasPrice() {
  const gweiValueElement = document.getElementById('gweiValue');
  if (!gweiValueElement) {
    console.error('GWEI value element not found');
    return;
  }
  gweiValueElement.textContent = 'Loading...';

  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice', // Standard Ethereum method, assuming HyperEVM is compatible
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message}`);
    }

    if (data.result) {
      const gasPriceHex = data.result;
      const gasPriceWei = parseInt(gasPriceHex, 16);
      const gasPriceGwei = (gasPriceWei / GWEI_CONVERSION_FACTOR).toFixed(2); // Show 2 decimal places
      gweiValueElement.textContent = `${gasPriceGwei} GWEI`;
    } else {
      gweiValueElement.textContent = 'N/A';
      console.error('No result in RPC response:', data);
    }

  } catch (error) {
    console.error('Failed to fetch gas price:', error);
    gweiValueElement.textContent = 'Error';
    // Display more specific error for debugging if needed
    // gweiValueElement.textContent = `Error: ${error.message}`; 
  }
}

// Optional: Set up an alarm for periodic updates (e.g., every minute)
// This requires the "alarms" permission in manifest.json
// chrome.alarms.create('fetchGasPriceAlarm', { periodInMinutes: 1 });
// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'fetchGasPriceAlarm') {
//     fetchGasPrice();
//   }
// });
