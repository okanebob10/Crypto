# CriptoGráfico (CryptoGraph)

A simple and modern web dashboard to visualize the current prices and the last 30 days' variation of 11 popular cryptocurrencies, including conversion to Brazilian Real (BRL).

## Overview

This project consists of a static web page (HTML, CSS, JavaScript) that fetches data from the public CoinGecko API. It displays:

*   The current price of the selected cryptocurrency in **USD**.
*   The converted price in **BRL**, using the current USD/BRL exchange rate.
*   An interactive chart of the last 30 days' prices, generated using Chart.js.

## Features

*   **Price Display:** Shows the most recent price in USD and BRL for each coin.
*   **Price Chart:** Displays a line chart of the last 30 days' prices.
*   **Coin Selection:** Allows switching between 11 different cryptocurrencies.
*   **Responsive Design:** Adapts to different screen sizes (desktop, mobile).

## Technologies Used

*   **HTML5**
*   **CSS3**
*   **JavaScript (ES6+)**
*   **[Chart.js](https://www.chartjs.org/):** For rendering the charts.
*   **[CoinGecko API](https://www.coingecko.com/api):** For retrieving cryptocurrency price data.
*   **[ExchangeRate-API](https://exchangerate-api.com/):** For retrieving the USD/BRL exchange rate.
*   **[CORS Proxy](https://corsproxy.io/):** To bypass CORS restrictions when making API requests directly from the browser.

## How to Use

1.  Visit the hosted site: [https://okanebob10.github.io/Crypto/](https://okanebob10.github.io/Crypto/)
2.  Select a cryptocurrency from the dropdown menu.
3.  The current price (in USD and BRL) and the chart will update automatically.

> **Note:** The site relies on external APIs. On some browsers, there might be a slight delay in initial loading or console error messages related to the CORS proxy, but the core functionality should remain intact.

## Project Structure

*   `index.html`: The main page structure.
*   `style.css`: Styles for layout and appearance.
*   `script.js`: JavaScript logic for fetching data, converting, and displaying the chart.

## License

This project is open-source and free to use.
