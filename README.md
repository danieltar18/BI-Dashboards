# 📊 BI Dashboards

Welcome to my **Business Intelligence & Data Visualization Portfolio**!  
Here, you'll find interactive dashboards created using **Looker Studio, Tableau, Power BI and Dune**, showcasing data-driven insights.

---
## Tableau

#### 🔷 First 24 Hours of Crypto FOMO Dashboard 📊

This dashboard gives immediate insights into cryptocurrency market behaviors following major "Fear of Missing Out (FOMO)" events triggered by influential global figures and entities.

#### 🚀 Key Features

- **📅 FOMO Event Selector**
  - Interactive selection of influential events affecting the cryptocurrency markets, including announcements from prominent political leaders, industry figures, and influential organizations.
- **📊 Top Cryptocurrencies Overview**
  - Detailed analysis featuring price charts for a 24-hour period, capturing market highs, lows, and trading volumes for the top cryptocurrencies.
- **⚙️ Real-Time Market Trends**
  - Visualizes immediate price reactions and historical trend data, clearly highlighting market changes due to specific events.
- **📈 Expanded Chart View**
  - Expand the chart to see the highlights of the FOMO event.

<p align="center">
  <a href="https://public.tableau.com/views/First24HourofFOMOinCrypto/Dashboard?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">
    <img src="images/tableau/fomo_dashboard.png" alt="First 24 Hour of FOMO in Crypto">
  </a>
</p>

#### 🔑 **Tech Stack**

- **Tableau Public** (Data Visualization)  
- **Binance API** (klines, 15 min data)

🤖 [View the Python script](./scripts/python_scripts/fomo_binance.py)  
🔗 [View Dashboard](https://public.tableau.com/views/First24HourofFOMOinCrypto/Dashboard?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link)


## Power BI


This Power BI dashboard provides a snapshot technical analysis of major cryptocurrencies. It gives traders and analysts immediate insight into market momentum, trends, and volatility—especially around rapid market movements triggered by news or global events.

#### 🚀 Key Features


- **⏱ Timeframe Selector**
  - Easily switch between key intervals like **5m, 15m, 1h, 1d, 1w,** and **1mo** to analyze short-term or long-term price action.
- **🪙 Cryptocurrency Picker**
  - Choose from top coins including **BTC, ETH, XRP, BNB, SOL, DOGE, ADA, TRX, SUI, LINK** for on-demand technical evaluations.
- **📈 Candlestick Chart**
  - Visual representation of asset price changes over time, highlighting open, high, low, and close (OHLC) movements to support trading decisions.
- **📌 Technical Indicator Summary**
  - Shows real-time values for:
    - **Oscillators**: RSI (14), Momentum (10), MACD (12, 26), Stochastic %K (14, 3), CCI (20), Williams %R (14)
    - **Moving Averages**: SMA and EMA across 10, 20, and 50 periods
- **🧭 Sentiment Gauge**
  - A bold summary dial condenses all indicators into a simple, clear **Buy / Sell / Neutral** rating—ideal for quick decisions.
- **🔎 Expandable Chart Area**
  - Focus view on a single coin’s reaction to an event or zoom into specific market behavior over time.

<p align="center">
    <img src="images/power_bi/technical_analysis_screenshot.png" alt="Technical Analysis">
  </a>
</p>


🤖 [View the Java script](./scripts/apps_scripts/powerbi_data.js)  
🔗 [View the Power BI File](./files/Technical_Analysis.pbix)  

## Looker Studio

### 🔷 Crypto Market Analysis Dashboard 📊

This project showcases a **Crypto Market Analysis Dashboard** built using **Looker Studio** with live data retrieved from the **CoinGecko API**. The dashboard provides real-time insights into the global crypto market, top trending coins, and historical price trends for the **top 10 cryptocurrencies** and **trending coins**.

#### 🚀 **Key Features**

- 🌐 **Global Market Overview**: Track total market cap, active cryptocurrencies, and trading volume.  
- 📈 **Trending Coins Dashboard**: Highlights the 15 most popular coins based on user activity.  
- 📊 **Historical Price Chart**: Monitors historical price movements for top 10 and trending coins.  
- 🔄 **Automated Updates**: Data refreshes daily, hourly, or every 4 hours, depending on the dataset.  
- ⚙️ **API Integration**: Utilizes CoinGecko API endpoints like **global**, **trending**, and **coins/ohlc**.  

<p align="center">
  <a href="https://lookerstudio.google.com/u/0/reporting/7df8f109-6f75-47ce-a48d-d4a8aa989d5d/page/sDkrE" target="_blank">
    <img src="images/looker_studio/crypto_market_analysis_lookerstudio.png" alt="Crypto Market Analysis">
  </a>
</p>


#### 🔑 **Tech Stack**

- **Looker Studio** (Data Visualization)  
- **Google Apps Script** (Data Fetching and Automation)  
- **CoinGecko API** (Live Crypto Data)

🤖 [View the Apps Script JS File](./scripts/apps_scripts/coingecko.js)  
🔗 [View Dashboard](https://lookerstudio.google.com/u/0/reporting/7df8f109-6f75-47ce-a48d-d4a8aa989d5d/page/sDkrE)


## Dune

### 🔷 Top Solana Memecoin Traders 📊

This project features a **Top Solana Memecoin Traders Dashboard** built using **Dune Analytics**. It tracks **Key Opinion Leaders (KOLs)** in the Solana memecoin ecosystem, providing insights into their trading activity, investments, and top-performing tokens.

*Static list of KOLs (leaderboard - on February 25, 2025)*

*https://kolscan.io/leaderboard*

#### 🚀 **Key Features**

- 📊 **Leaderboard & PnL Tracking**: Displays the top traders based on profits and returns.  
- 🔍 **KOL Wallet Analysis**: Identifies top wallets engaged in high-volume memecoin trading.  
- 💰 **Top Tokens & Pairs**: Highlights the most-traded and most-profitable memecoins.  
- ⏳ **Trading Hours Analysis**: Visualizes hourly transaction trends and volume spikes.  
- 🔗 **Yesterday Data**: Powered by Dune Analytics for up-to-date tracking of Solana DEX trades.  

<p align="center">
  <a href="https://dune.com/flamenco18/top-solana-kols" target="_blank">
    <img src="images/dune/top_kols_dashboard.png" alt="Top KOLs Dashboard">
  </a>
</p>

🤖 [View DuneSQL files](./scripts/dune_sqls)  
🔗 [View Dashboard](https://dune.com/flamenco18/top-solana-kols)


💡 _Always DYOR before making financial decisions!_

---

