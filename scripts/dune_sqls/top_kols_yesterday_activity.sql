/* 
1.) Calculate yesterday bought-sold SOL amount (for PNL)
2.) 
*/


SELECT 
    date_trunc('hour', block_time) AS trading_date,
    COUNT(DISTINCT tx_id) AS transactions_number,
    SUM(amount_usd) AS transactions_volume_usd
FROM dune.flamenco18.result_top_kols_trades
WHERE
    DATE(block_time) = DATE_ADD('day', -1, CURRENT_DATE)
GROUP BY date_trunc('hour', block_time)
ORDER BY 1
