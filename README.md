# HyperEVM Gas Tracker Chrome Extension

A Chrome extension that displays current gas prices for the HyperEVM blockchain, featuring multiple price tiers (Normal, Fast, Instant), USD cost calculations, and automatic updates.

## Features

- **Multiple Gas Price Tiers**: Displays Normal, Fast, and Instant gas price options with different multipliers
- **GWEI Values with Precision**: Shows gas prices with two decimal places for better accuracy
- **USD Cost Calculation**: Calculates and displays the estimated transaction cost in USD for each gas price tier
- **HYPE Price Integration**: Fetches the current HYPE token price from the HyperLiquid API
- **Automatic Updates**: Refreshes gas prices automatically every minute
- **Timestamp Display**: Shows when the data was last updated, with both exact time and relative time indicators
- **Manual Refresh**: Allows users to manually refresh gas prices with a button click
- **Enhanced Error Handling**: Provides specific error messages for different failure scenarios
- **HyperLiquid Branding**: Uses official HyperLiquid mint green color scheme and branding

## How It Works

The extension fetches the current gas price from the official HyperEVM JSON-RPC endpoint (`https://rpc.hyperliquid.xyz/evm`) using the `eth_gasPrice` method. It also fetches the current HYPE token price from the HyperLiquid API (`https://api.hyperliquid.xyz/info`). The gas price is converted to GWEI and displayed in three tiers:

- **Normal**: Base gas price (1.0x multiplier)
- **Fast**: Slightly higher gas price for faster transactions (1.2x multiplier)
- **Instant**: Highest gas price for immediate transactions (1.5x multiplier)

USD costs are calculated by multiplying the gas price by the standard gas limit (21,000) and the current HYPE price.

## Files

- `manifest.json`: Defines the extension, its permissions, and references to other files.
- `popup.html`: The HTML structure for the popup window with the gas price table.
- `popup.js`: Contains the JavaScript logic to fetch gas prices and HYPE price data, calculate USD costs, and update the UI.
- `style.css`: Provides styling for the popup using the HyperLiquid color scheme.
- `images/`: Directory containing the extension icons based on HyperLiquid branding.
- `LICENSE`: Contains the open-source license for this project.

## Setup / Installation

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" using the toggle in the top right corner.
4. Click the "Load unpacked" button.
5. Select the directory where you cloned/downloaded these files.
6. The HyperEVM Gas Tracker icon should appear in your Chrome toolbar.

## Completed Features

- ✅ **Multiple Gas Price Tiers**: Implemented Normal, Fast, and Instant tiers
- ✅ **GWEI Values with Precision**: Added two decimal places for gas prices
- ✅ **USD Cost Calculation**: Added USD cost display for each tier
- ✅ **HYPE Price Integration**: Implemented API integration with HyperLiquid
- ✅ **Automatic Updates**: Enabled periodic updates via Chrome alarms
- ✅ **Timestamp Display**: Added last updated time with relative indicators
- ✅ **Enhanced Error Handling**: Implemented descriptive error messages
- ✅ **Refined Host Permissions**: Limited permissions to specific API endpoints
- ✅ **HyperLiquid Branding**: Used official color scheme and design elements

## Future Enhancements

- **Historical Data**: Add a graph showing gas price trends over time
- **User Preferences**: Allow users to customize update frequency and gas price tiers
- **Notifications**: Add alerts for significant gas price changes
- **Internationalization (i18n)**: Add support for multiple languages
