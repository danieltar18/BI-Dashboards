/**
 * Entry point: Fetch technical indicators and write to Sheet1.
 */
function main() {
  const SHEET_NAME = 'Sheet1';
  const DATA_POINTS = 200;

  const sheet = getOrCreateSheet(SHEET_NAME);
  setupHeader(sheet, HEADER_INDICATORS);
  formatTimeColumn(sheet);

  const rows = fetchIndicatorData(ASSETS, TIMEFRAMES, DATA_POINTS);
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, HEADER_INDICATORS.length).setValues(rows);
  }
}

/**
 * Entry point: Fetch OHLC data and write to Sheet2.
 */
function main2() {
  const SHEET_NAME = 'Sheet2';
  const DATA_POINTS = 50;

  const sheet = getOrCreateSheet(SHEET_NAME);
  setupHeader(sheet, HEADER_OHLC);
  formatTimeColumn(sheet);

  const rows = fetchOHLCData(ASSETS, TIMEFRAMES, DATA_POINTS);
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, HEADER_OHLC.length).setValues(rows);
  }
}

// ----------------------
// Configuration
// ----------------------
const ASSETS = [
  { name: 'BTC', symbol: 'BTC-USD' },
  { name: 'ETH', symbol: 'ETH-USD' },
  { name: 'XRP', symbol: 'XRP-USD' },
  { name: 'BNB', symbol: 'BNB-USD' },
  { name: 'SOL', symbol: 'SOL-USD' },
  { name: 'DOGE', symbol: 'DOGE-USD' },
  { name: 'ADA', symbol: 'ADA-USD' },
  { name: 'TRX', symbol: 'TRX-USD' },
  { name: 'SUI', symbol: 'SUI20947-USD' },
  { name: 'LINK', symbol: 'LINK-USD' }
];

const TIMEFRAMES = [
  { label: '5m', interval: '5m', range: '1d' },
  { label: '15m', interval: '15m', range: '5d' },
  { label: '1h', interval: '60m', range: '1mo' },
  { label: '1d', interval: '1d', range: '1y' },
  { label: '1w', interval: '1wk', range: '5y' },
  { label: '1mo', interval: '1mo', range: 'max' }
];

const HEADER_INDICATORS = [
  'Asset','Timeframe','Time','Price',
  'RSI(14)','SMA(14)','EMA(14)',
  'SMA(10)','EMA(10)','SMA(20)','EMA(20)',
  'SMA(50)','EMA(50)','Momentum(10)',
  'MACD','Signal','Stoch %K','CCI','AO','W%R','Gauge Score'
];

const HEADER_OHLC = ['Asset','Timeframe','Time','Open','High','Low','Close'];

// ----------------------
// Sheet Helpers
// ----------------------
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Europe/Berlin');
  let sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  clearContentBelowHeader(sheet);
  return sheet;
}

function clearContentBelowHeader(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
}

function setupHeader(sheet, header) {
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
}

function formatTimeColumn(sheet) {
  const maxRows = sheet.getMaxRows();
  sheet.getRange(`C2:C${maxRows}`).setNumberFormat('yyyy-MM-dd HH:mm:ss');
}

// ----------------------
// Indicator Data Fetching
// ----------------------
function fetchIndicatorData(assets, timeframes, points) {
  const rows = [];
  assets.forEach(asset => {
    timeframes.forEach(tf => {
      const row = fetchTimeframeIndicators(asset, tf, points);
      if (row) rows.push(row);
      Utilities.sleep(500);
    });
  });
  return rows;
}

function fetchTimeframeIndicators(asset, tf, points) {
  try {
    const url = buildYahooUrl(asset.symbol, tf.range, tf.interval);
    const json = fetchJson(url);
    const result = json.chart.result[0];
    const ts = result.timestamp.map(t => new Date(t * 1000));
    const quote = result.indicators.quote[0];
    const closes = quote.close.map(v => v === null ? NaN : v);

    const start = Math.max(0, closes.length - points);
    const slice = closes.slice(start);
    if (slice.some(isNaN)) throw new Error('Invalid data');

    const i = slice.length - 1;
    const latestTime = ts[start + i];
    const latestPrice = slice[i];

    const rsi = calculateRSI(slice, 14)[i];
    const sma14 = calculateSMA(slice, 14)[i];
    const ema14 = calculateEMA(slice, 14)[i];
    const sma10 = calculateSMA(slice, 10)[i];
    const ema10 = calculateEMA(slice, 10)[i];
    const sma20 = calculateSMA(slice, 20)[i];
    const ema20 = calculateEMA(slice, 20)[i];
    const sma50 = calculateSMA(slice, 50)[i];
    const ema50 = calculateEMA(slice, 50)[i];
    const mom = calculateMomentum(slice, 10)[i];
    const { macdLine, signalLine } = calculateMACD(slice);
    const stochK = calculateStochasticK(slice)[i];
    const cci = calculateCCI(slice)[i];
    const ao = calculateAwesomeOscillator(slice)[i];
    const wpr = calculateWilliamsR(slice)[i];

    const maScore = computeMAScore(latestPrice, sma14, ema14);
    const gauge = calculateGaugeScore(rsi, mom, stochK, wpr, maScore);

    return [
      asset.name, tf.label, latestTime, latestPrice,
      rsi, sma14, ema14, sma10, ema10, sma20, ema20,
      sma50, ema50, mom, macdLine[i], signalLine[i],
      stochK, cci, ao, wpr, gauge
    ];
  } catch (e) {
    Logger.log(`Error ${asset.name} ${tf.label}: ${e}`);
    return null;
  }
}

// ----------------------
// OHLC Data Fetching
// ----------------------
function fetchOHLCData(assets, timeframes, points) {
  const rows = [];
  assets.forEach(asset => {
    timeframes.forEach(tf => {
      rows.push(...fetchTimeframeOHLC(asset, tf, points));
      Utilities.sleep(500);
    });
  });
  return rows;
}

function fetchTimeframeOHLC(asset, tf, points) {
  try {
    const url = buildYahooUrl(asset.symbol, tf.range, tf.interval);
    const json = fetchJson(url);
    const result = json.chart.result[0];
    const ts = result.timestamp.map(t => new Date(t * 1000));
    const quote = result.indicators.quote[0];

    const start = Math.max(0, ts.length - points);
    return ts.slice(start).map((t, i) => [
      asset.name, tf.label, t,
      quote.open[start + i], quote.high[start + i],
      quote.low[start + i], quote.close[start + i]
    ]);
  } catch (e) {
    Logger.log(`Error ${asset.name} ${tf.label}: ${e}`);
    return [];
  }
}

// ----------------------
// Utility Functions
// ----------------------
function buildYahooUrl(symbol, range, interval) {
  return `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
}

function fetchJson(url, retries = 3, delay = 2000) {
  let err;
  for (let i = 0; i < retries; i++) {
    try {
      const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) return JSON.parse(res.getContentText());
      err = new Error(`HTTP ${res.getResponseCode()}`);
    } catch (e) {
      err = e;
    }
    Utilities.sleep(delay);
  }
  throw err;
}

function average(arr) {
  const vals = arr.filter(x => !isNaN(x));
  return vals.length ? vals.reduce((a, b) => a + b) / vals.length : NaN;
}

function calculateSMA(values, period) {
  return values.map((_, i) => (i < period - 1 ? null : average(values.slice(i - period + 1, i + 1))));
}

function calculateEMA(values, period) {
  const k = 2 / (period + 1);
  return values.map((v, i, arr) => {
    if (i < period - 1) return null;
    if (i === period - 1) return average(arr.slice(0, period));
    return v * k + this[i - 1] * (1 - k);
  });
}

function calculateRSI(values, period) {
  const rsi = Array(values.length).fill(null);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    gains += Math.max(diff, 0);
    losses += Math.max(-diff, 0);
  }
  let avgGain = gains / period, avgLoss = losses / period;
  rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return rsi;
}

function calculateMomentum(values, period) {
  return values.map((v, i) => (i < period ? null : v - values[i - period]));
}

function calculateMACD(values) {
  const ema12 = calculateEMA(values, 12);
  const ema26 = calculateEMA(values, 26);
  const macdLine = values.map((_, i) => (ema12[i] !== null && ema26[i] !== null ? ema12[i] - ema26[i] : null));
  const signalLine = calculateEMA(macdLine.map(v => v || 0), 9);
  return { macdLine, signalLine };
}

function calculateStochasticK(values, period = 14, smooth = 3) {
  const raw = values.map((v, i) => {
    if (i < period - 1) return null;
    const slice = values.slice(i - period + 1, i + 1);
    const high = Math.max(...slice), low = Math.min(...slice);
    return high === low ? 50 : ((v - low) / (high - low)) * 100;
  });
  return calculateSMA(raw, smooth);
}

function calculateCCI(values, period = 20) {
  const smaArr = calculateSMA(values, period);
  return values.map((v, i) => {
    if (i < period - 1) return null;
    const slice = values.slice(i - period + 1, i + 1);
    const mean = smaArr[i];
    const meanDev = slice.reduce((sum, x) => sum + Math.abs(x - mean), 0) / period;
    return meanDev === 0 ? 0 : (v - mean) / (0.015 * meanDev);
  });
}

function calculateAwesomeOscillator(values) {
  const sma5 = calculateSMA(values, 5);
  const sma34 = calculateSMA(values, 34);
  return values.map((_, i) => (sma5[i] !== null && sma34[i] !== null ? sma5[i] - sma34[i] : null));
}

function calculateWilliamsR(values, period = 14) {
  return values.map((v, i) => {
    if (i < period - 1) return null;
    const slice = values.slice(i - period + 1, i + 1);
    const high = Math.max(...slice), low = Math.min(...slice);
    return high === low ? -50 : ((high - v) / (high - low)) * -100;
  });
}

function calculateGaugeScore(rsi, mom, stochK, wpr, maScore) {
  const signals = [
    rsi > 70 ? -1 : rsi < 30 ? 1 : 0,
    mom > 0 ? 1 : -1,
    stochK > 80 ? -1 : stochK < 20 ? 1 : 0,
    wpr > -20 ? -1 : wpr < -80 ? 1 : 0
  ];
  const validSignals = signals.filter(s => s !== 0);
  if (!validSignals.length) return null;
  const oscScore = signals.reduce((a, b) => a + b, 0) / signals.length;
  return parseFloat((oscScore * 0.4 + maScore * 0.6).toFixed(2));
}
