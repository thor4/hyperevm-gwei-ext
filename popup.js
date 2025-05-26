// Placeholder for the HyperEVM RPC URL
const RPC_URL = 'https://rpc.hyperliquid.xyz/evm';
const GWEI_CONVERSION_FACTOR = 1_000_000_000;

const FAST_MULTIPLIER = 1.2;
const NORMAL_MULTIPLIER = 1.0;
const SLOW_MULTIPLIER = 0.8;

let lastUpdateTime = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchGasPrice();
  
  const refreshButton = document.getElementById('refreshButton');
  if (refreshButton) {
    refreshButton.addEventListener('click', fetchGasPrice);
  }
  
  updateTimeSinceRefresh();
  setInterval(updateTimeSinceRefresh, 5000); // Update every 5 seconds
});

async function fetchGasPrice() {
  const fastGweiElement = document.getElementById('fastGwei');
  const normalGweiElement = document.getElementById('normalGwei');
  const slowGweiElement = document.getElementById('slowGwei');
  const updateTimeElement = document.getElementById('updateTime');
  
  if (!fastGweiElement || !normalGweiElement || !slowGweiElement) {
    console.error('One or more GWEI value elements not found');
    return;
  }
  
  fastGweiElement.textContent = 'Loading...';
  normalGweiElement.textContent = 'Loading...';
  slowGweiElement.textContent = 'Loading...';

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
      
      const normalGasPriceGwei = (gasPriceWei / GWEI_CONVERSION_FACTOR).toFixed(0);
      const fastGasPriceGwei = (gasPriceWei * FAST_MULTIPLIER / GWEI_CONVERSION_FACTOR).toFixed(0);
      const slowGasPriceGwei = (gasPriceWei * SLOW_MULTIPLIER / GWEI_CONVERSION_FACTOR).toFixed(0);
      
      fastGweiElement.textContent = fastGasPriceGwei;
      normalGweiElement.textContent = normalGasPriceGwei;
      slowGweiElement.textContent = slowGasPriceGwei;
      
      lastUpdateTime = new Date();
      updateTimeElement.textContent = formatTime(lastUpdateTime);
      
      document.querySelector('.timestamp').textContent = 'now';
      
    } else {
      fastGweiElement.textContent = 'N/A';
      normalGweiElement.textContent = 'N/A';
      slowGweiElement.textContent = 'N/A';
      console.error('No result in RPC response:', data);
    }

  } catch (error) {
    console.error('Failed to fetch gas price:', error);
    
    let errorMessage = 'Error';
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      errorMessage = 'Network Error';
    } else if (error.message.includes('HTTP error')) {
      errorMessage = 'RPC Server Error';
    } else if (error.message.includes('RPC Error')) {
      errorMessage = 'RPC Error';
    }
    
    fastGweiElement.textContent = errorMessage;
    normalGweiElement.textContent = errorMessage;
    slowGweiElement.textContent = errorMessage;
    
    console.debug(`Detailed error: ${error.message}`);
  }
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateTimeSinceRefresh() {
  if (!lastUpdateTime) return;
  
  const now = new Date();
  const secondsAgo = Math.floor((now - lastUpdateTime) / 1000);
  
  const timestampElement = document.querySelector('.timestamp');
  if (timestampElement) {
    if (secondsAgo < 60) {
      timestampElement.textContent = `${secondsAgo}s ago`;
    } else {
      const minutesAgo = Math.floor(secondsAgo / 60);
      timestampElement.textContent = `${minutesAgo}m ago`;
    }
  }
}

// Set up an alarm for periodic updates (every minute)
// This requires the "alarms" permission in manifest.json
chrome.alarms.create('fetchGasPriceAlarm', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetchGasPriceAlarm') {
    fetchGasPrice();
  }
});
