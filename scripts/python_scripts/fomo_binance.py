import requests
import pandas as pd
from datetime import datetime, timedelta, timezone 
import time

fomo_events = [
    {"name": "Tesla Accepts Bitcoin", "timestamp": datetime(2021, 2, 8, 8, 0, tzinfo=timezone.utc)},
    {"name": "China Bans Bitcoin Mining", "timestamp": datetime(2021, 5, 21, 12, 0, tzinfo=timezone.utc)},
    {"name": "Tesla Stops Accepting Bitcoin", "timestamp": datetime(2021, 5, 12, 22, 0, tzinfo=timezone.utc)},
    {"name": "Elon Boosts DOGE (Tesla Merch)", "timestamp": datetime(2021, 12, 14, 7, 0, tzinfo=timezone.utc)}, 
    {"name": "China Reiterates Crypto Ban", "timestamp": datetime(2021, 9, 24, 7, 0, tzinfo=timezone.utc)},
    {"name": "Ripple Wins SEC Case", "timestamp": datetime(2023, 7, 13, 16, 0, tzinfo=timezone.utc)},
    {"name": "Elon Teases DOGE Again", "timestamp": datetime(2024, 3, 14, 9, 0, tzinfo=timezone.utc)},
    {"name": "Elon Musk SpaceX BTC Moon", "timestamp": datetime(2024, 3, 4, 14, 0, tzinfo=timezone.utc)},
    {"name": "Trump Election Victory", "timestamp": datetime(2024, 11, 6, 6, 0, tzinfo=timezone.utc)},
    {"name": "Trump U.S. Crypto Reserve", "timestamp": datetime(2025, 3, 2, 15, 0, tzinfo=timezone.utc)},
]

symbols = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "BNBUSDT", "TRXUSDT", "LTCUSDT", "LINKUSDT"]
interval = "15m"

end_time = int(datetime.now(timezone.utc).timestamp() * 1000)
start_time = int((datetime.now(timezone.utc) - timedelta(days=5*365)).timestamp() * 1000)

all_data_frames = []

for symbol in symbols:
    print(f"Fetching data for {symbol}...")
    url = "https://api.binance.com/api/v3/klines"
    cur_start = start_time
    symbol_data = []
    
    while cur_start < end_time:
        params = {
            "symbol": symbol,
            "interval": interval,
            "startTime": cur_start,
            "endTime": end_time,
            "limit": 1000
        }
        try:
            resp = requests.get(url, params=params)
            resp.raise_for_status()
            candles = resp.json()
            if not candles:
                break
            
            for candlestick in candles:
                open_time = candlestick[0]
                open_price = float(candlestick[1])
                high_price = float(candlestick[2])
                low_price = float(candlestick[3])
                close_price = float(candlestick[4])
                volume = float(candlestick[5])
                symbol_data.append({
                    "timestamp_ms": open_time,
                    "datetime": datetime.fromtimestamp(open_time / 1000.0, tz=timezone.utc),
                    "symbol": symbol.replace("USDT", ""),
                    "open": open_price,
                    "high": high_price,
                    "low": low_price,
                    "close": close_price,
                    "volume": volume
                })
            cur_start = candles[-1][0] + 1
            time.sleep(0.1)
        
        except requests.RequestException as e:
            print(f"Error fetching {symbol} at {cur_start}: {e}")
            break
    
    if symbol_data:
        df_symbol = pd.DataFrame(symbol_data)
        all_data_frames.append(df_symbol)
    else:
        print(f"No data retrieved for {symbol}")

if all_data_frames:
    df_all = pd.concat(all_data_frames, ignore_index=True)
    
    df_all["fomo_event"] = None
    
    for event in fomo_events:
        event_start = event["timestamp"]
        event_end = event_start + timedelta(hours=24)
        mask = (df_all["datetime"] >= event_start) & (df_all["datetime"] < event_end)
        df_all.loc[mask, "fomo_event"] = event["name"]
        
    df_all.to_csv("crypto_15min_prices_with_fomo.csv", index=False)
    print(f"Data saved to 'crypto_15min_prices_with_fomo.csv' with {len(df_all)} rows.")
else:
    print("No data to save.")