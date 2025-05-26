# HyperEVM Gas Tracker Chrome Extension

A simple Google Chrome extension to display the current gas price (in GWEI) for the HyperEVM blockchain.

## How It Works

The extension fetches the current gas price from the official HyperEVM JSON-RPC endpoint (`https://rpc.hyperliquid.xyz/evm`) using the `eth_gasPrice` method. The result, typically in Wei, is converted to GWEI and displayed in the extension's popup.

## Files

- `manifest.json`: Defines the extension, its permissions, and references to other files.
- `popup.html`: The HTML structure for the popup window.
- `popup.js`: Contains the JavaScript logic to fetch data from the RPC and update the popup.
- `style.css`: Provides basic styling for the popup.
- `images/`: Directory containing placeholder icons (icon16.png, icon48.png, icon128.png).
- `LICENSE`: Contains the open-source license for this project.

## Setup / Installation

1.  Clone or download this repository.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" using the toggle in the top right corner.
4.  Click the "Load unpacked" button.
5.  Select the directory where you cloned/downloaded these files.
6.  The HyperEVM Gas Tracker icon should appear in your Chrome toolbar.

## Next Steps / Pending Issues

-   **Thorough In-Browser Testing:**
    -   Load the extension as an unpacked extension in Google Chrome.
    -   Verify UI elements display correctly.
    -   Confirm that gas prices are fetched and displayed accurately.
    -   Check the browser console for any errors during load or operation.
-   **Verify RPC CORS Policy:**
    -   Ensure the HyperEVM RPC endpoint (`https://rpc.hyperliquid.xyz/evm`) has a permissive Cross-Origin Resource Sharing (CORS) policy that allows requests from `chrome-extension://[EXTENSION_ID]`. If not, the extension will not be able to fetch data.
-   **Refine Host Permissions:**
    -   Once functionality is confirmed, update `manifest.json` to change the host permission from the broad `https://*/*` to the specific RPC endpoint: `https://rpc.hyperliquid.xyz/*` for better security.
-   **Enhanced Error Handling:**
    -   Implement more descriptive error messages in the UI for different failure scenarios (e.g., network down, RPC error, no data, rate limiting).
-   **Enable Periodic Updates:**
    -   Uncomment and test the `chrome.alarms` code in `popup.js` to allow automatic background refreshes of the gas price (requires "alarms" permission, which is already in `manifest.json`).
-   **Actual Icons:**
    -   Replace the placeholder `icon16.png`, `icon48.png`, and `icon128.png` with actual, properly designed icons for the extension.
-   **Code Refinements:**
    -   Consider refactoring for clarity or efficiency if needed after testing.
-   **Internationalization (i18n):**
    -   If broader distribution is planned, add support for multiple languages.
