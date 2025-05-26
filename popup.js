const RPC_URL = 'https://rpc.hyperliquid.xyz/evm';
const HYPE_API_URL = 'https://api.hyperliquid.xyz/info';
const GWEI_CONVERSION_FACTOR = 1_000_000_000;

const NORMAL_MULTIPLIER = 1.0;
const FAST_MULTIPLIER = 1.2;
const INSTANT_MULTIPLIER = 1.5;

const STANDARD_GAS_LIMIT = 21000;

let lastUpdateTime = null;
let hypePrice = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchGasPrice();
  
  const refreshButton = document.getElementById('refreshButton');
  if (refreshButton) {
    refreshButton.addEventListener('click', fetchGasPrice);
  }
  
  updateTimeSinceRefresh();
  setInterval(updateTimeSinceRefresh, 5000); // Update every 5 seconds
});

async function fetchGasPriceData() {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
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

    return data;
  } catch (error) {
    console.error('Failed to fetch gas price:', error);
    throw error;
  }
}

async function fetchHypePrice() {
  try {
    const response = await fetch(HYPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'allMids'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.HYPE) {
      hypePrice = parseFloat(data.HYPE);
      document.getElementById('hypePriceValue').textContent = hypePrice.toFixed(2);
      return hypePrice;
    } else {
      throw new Error('HYPE price not found in response');
    }
  } catch (error) {
    console.error('Failed to fetch HYPE price:', error);
    document.getElementById('hypePriceValue').textContent = 'Error';
    return null;
  }
}

async function fetchGasPrice() {
  const normalGweiElement = document.getElementById('normalGwei');
  const fastGweiElement = document.getElementById('fastGwei');
  const instantGweiElement = document.getElementById('instantGwei');
  const normalUsdElement = document.getElementById('normalUsd');
  const fastUsdElement = document.getElementById('fastUsd');
  const instantUsdElement = document.getElementById('instantUsd');
  const updateTimeElement = document.getElementById('updateTime');
  const hypePriceElement = document.getElementById('hypePriceValue');
  
  if (!normalGweiElement || !fastGweiElement || !instantGweiElement) {
    console.error('One or more GWEI value elements not found');
    return;
  }
  
  normalGweiElement.textContent = 'Loading...';
  fastGweiElement.textContent = 'Loading...';
  instantGweiElement.textContent = 'Loading...';
  if (hypePriceElement) hypePriceElement.textContent = 'Loading...';

  try {
    const [gasData, hypePriceValue] = await Promise.all([
      fetchGasPriceData(),
      fetchHypePrice()
    ]);

    if (gasData && gasData.result) {
      const gasPriceHex = gasData.result;
      const gasPriceWei = parseInt(gasPriceHex, 16);
      
      const normalGasPriceGwei = (gasPriceWei * NORMAL_MULTIPLIER / GWEI_CONVERSION_FACTOR).toFixed(2);
      const fastGasPriceGwei = (gasPriceWei * FAST_MULTIPLIER / GWEI_CONVERSION_FACTOR).toFixed(2);
      const instantGasPriceGwei = (gasPriceWei * INSTANT_MULTIPLIER / GWEI_CONVERSION_FACTOR).toFixed(2);
      
      normalGweiElement.textContent = normalGasPriceGwei;
      fastGweiElement.textContent = fastGasPriceGwei;
      instantGweiElement.textContent = instantGasPriceGwei;
      
      if (hypePrice && normalUsdElement && fastUsdElement && instantUsdElement) {
        const normalUsdCost = (parseFloat(normalGasPriceGwei) * STANDARD_GAS_LIMIT * hypePrice / 1e9).toFixed(4);
        const fastUsdCost = (parseFloat(fastGasPriceGwei) * STANDARD_GAS_LIMIT * hypePrice / 1e9).toFixed(4);
        const instantUsdCost = (parseFloat(instantGasPriceGwei) * STANDARD_GAS_LIMIT * hypePrice / 1e9).toFixed(4);
        
        normalUsdElement.textContent = `$${normalUsdCost}`;
        fastUsdElement.textContent = `$${fastUsdCost}`;
        instantUsdElement.textContent = `$${instantUsdCost}`;
      }
      
      lastUpdateTime = new Date();
      updateTimeElement.textContent = formatTime(lastUpdateTime);
      document.querySelector('.timestamp').textContent = 'now';
    } else {
      normalGweiElement.textContent = 'N/A';
      fastGweiElement.textContent = 'N/A';
      instantGweiElement.textContent = 'N/A';
      if (normalUsdElement) normalUsdElement.textContent = 'N/A';
      if (fastUsdElement) fastUsdElement.textContent = 'N/A';
      if (instantUsdElement) instantUsdElement.textContent = 'N/A';
      console.error('No result in RPC response:', gasData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    
    let errorMessage = 'Error';
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      errorMessage = 'Network Error';
    } else if (error.message.includes('HTTP error')) {
      errorMessage = 'RPC Server Error';
    } else if (error.message.includes('RPC Error')) {
      errorMessage = 'RPC Error';
    }
    
    normalGweiElement.textContent = errorMessage;
    fastGweiElement.textContent = errorMessage;
    instantGweiElement.textContent = errorMessage;
    if (normalUsdElement) normalUsdElement.textContent = errorMessage;
    if (fastUsdElement) fastUsdElement.textContent = errorMessage;
    if (instantUsdElement) instantUsdElement.textContent = errorMessage;
    
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
