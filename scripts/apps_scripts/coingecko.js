// Google Apps Script to fetch trending coins from CoinGecko API and write to a sheet
function fetchTrendingCoins() {
  var url = "https://api.coingecko.com/api/v3/search/trending";
  var headers = {
    "accept": "application/json",
    "x-cg-demo-api-key": "your_demo_key", 
    "vs-currency": "usd",
    "duration": "24h"
  };
  
  var options = {
    'method': 'get',
    'headers': headers,
    'muteHttpExceptions': true
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("trending_coins_24h");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("trending_coins_24h");
  } else {
    sheet.clear();
  }

  sheet.appendRow(["run_datetime_utc", "trending_rank", "coin_id", "coin_symbol", "coin_name", "coin_thumb", "market_cap", "market_cap_rank", "price_usd", "price_change_pct_24h", "total_volume_24h", "description", "homepage", "discord_chat", "telegram_channel", "twitter_channel", "telegram_channel_user_count", "twitter_followers"]);

  //description, links.homepage[0], links.chat_url, links.telegram_channel_identifier, links.twitter_screen_name, community_data.twitter_followers, community_data.telegram_channel_user_count
  
  var idx = 1;
  var runDatetime = Utilities.formatDate(new Date(), "Etc/GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  // Write coin data with UTC run datetime
  json.coins.forEach(function(coin) {
    var item = coin.item;
  
    var url = "https://api.coingecko.com/api/v3/coins/" + item.id;
    var headers = {
      "accept": "application/json",
      "x-cg-demo-api-key": "your_demo_key", 
      "community-data": "true"
    };
    
    var options = {
      'method': 'get',
      'headers': headers,
      'muteHttpExceptions': true
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var json_coin_info = JSON.parse(response.getContentText());

    if (json_coin_info.links.telegram_channel_identifier && json_coin_info.links.telegram_channel_identifier !== "") {
        var telegram_channel = "t.me/" + json_coin_info.links.telegram_channel_identifier;
    }

    if (json_coin_info.links.twitter_screen_name && json_coin_info.links.twitter_screen_name !== "") {
        var x_site = "x.com/" + json_coin_info.links.twitter_screen_name;
    }

    sheet.appendRow([
      runDatetime,
      idx,
      item.id,
      item.symbol,
      item.name,
      item.large,
      item.data.market_cap.toString().replace("$", "").replace(/,/g, ""),
      item.market_cap_rank,
      item.data.price,
      item.data.price_change_percentage_24h.usd / 100,
      item.data.total_volume.toString().replace("$", "").replace(/,/g, ""),
      json_coin_info.description.en,
      json_coin_info.links.homepage[0],
      json_coin_info.links.chat_url[0],
      telegram_channel,
      x_site,
      json_coin_info.community_data.telegram_channel_user_count,
      json_coin_info.community_data.twitter_followers
    ]);
    idx++;
  });
}


// Fetching market data
function fetchCryptoMarket() {
  var url = "https://api.coingecko.com/api/v3/global";
  var headers = {
    "accept": "application/json",
    "x-cg-demo-api-key": "your_demo_key", 
  };
  
  var options = {
    'method': 'get',
    'headers': headers,
    'muteHttpExceptions': true
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("market_data");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("market_data");
  } else {
    if (sheet.getLastRow() > 366) {
        sheet.deleteRow(1); 
      }
    }

  // MARKET DATA Sheet
  // Write headers with UTC run datetime, first run only
  //sheet.appendRow(["run_date", "active_cryptocurrencies", "markets", "total_market_cap", "total_volume", "market_cap_change_percentage_24h_usd"]);
  
  var runDatetime = Utilities.formatDate(new Date(), "Etc/GMT", "yyyy-MM-dd");

  sheet.appendRow([
    runDatetime,
    json.data.active_cryptocurrencies,
    json.data.markets,
    json.data.total_market_cap.usd,
    json.data.total_volume.usd,
    json.data.market_cap_change_percentage_24h_usd / 100,
  ]);

  // BTC Dominance Sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("btc_dominance");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("btc_dominance");
  } else {
    if (sheet.getLastRow() > 366) {
        sheet.deleteRow(1); 
      }
    }

  //sheet.appendRow(["run_date", "coin_name", "market_cap_percentage"]);
  
  var runDatetime = Utilities.formatDate(new Date(), "Etc/GMT", "yyyy-MM-dd");
  var total_percent_top10 = 0;

  for (var key in json.data.market_cap_percentage) {
      sheet.appendRow([
          runDatetime,
          key,
          json.data.market_cap_percentage[key] / 100
      ]);

      // Add the value to total_percent_top10
      total_percent_top10 += json.data.market_cap_percentage[key] / 100;
  }

  sheet.appendRow([runDatetime, "rest_of_cryptocurrencies", 1-total_percent_top10]);

}


function getHistoricalPrice() {
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("coins_historical_price");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("coins_historical_price");
  } else {
    sheet.clear();
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('trending_coins_24h');

  var coinIds = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
  
  // Flatten the 2D array into a 1D list
  var coinIdList = coinIds.map(function(row) {
    return row[0];
  });

  var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";
  var headers = {
    "accept": "application/json",
    "x-cg-demo-api-key": "your_demo_key"
  };

  var options = {
    'method': 'get',
    'headers': headers,
    'muteHttpExceptions': true
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText())

  json.forEach(function(coin) {
    var coin_id = coin.id;

    if (!coinIdList.includes(coin_id)) {
        coinIdList.push(coin_id);
        console.log(`${coin_id} added!`);
    } else {
        console.log(`${coin_id} already exists.`);
    }

  });

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("coins_historical_price");
  sheet.appendRow(["run_datetime", "coin_id", "unix_timestamp","open", "high", "low", "close"]);
  var runDatetime = Utilities.formatDate(new Date(), "Etc/GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

  for (var coin_id of coinIdList) {
    console.log(coin_id);

    var url = `https://api.coingecko.com/api/v3/coins/${coin_id}/ohlc?vs_currency=usd&days=30&precision=12`;
    var headers = {
      "accept": "application/json",
      "x-cg-demo-api-key": "your_demo_key"
    };

    var options = {
      'method': 'get',
      'headers': headers,
      'muteHttpExceptions': true
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var jsonData = JSON.parse(response.getContentText());

    var formattedData = jsonData.map(function(row) {
      return [runDatetime, coin_id].concat(row);
    });
    
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, formattedData.length, formattedData[0].length).setValues(formattedData);

    console.log('Data inserted successfully!');

  }
}



















