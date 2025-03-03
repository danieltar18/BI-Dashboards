/* 
1.) Calculate yesterday bought-sold SOL amount (for PNL)
2.) 
*/

WITH solana_bought AS (
SELECT 
    DATE(block_time) AS trading_date,
    trader_id,
    token_bought_symbol,
    token_bought_mint_address,
    SUM(token_bought_amount) AS total_bought_sol_amount,
    SUM(amount_usd) AS total_bought_sol_amount_usd
FROM dune.flamenco18.result_top_kols_trades
WHERE
        DATE(block_time) = DATE_ADD('day', -1, CURRENT_DATE)
    AND token_bought_mint_address = 'So11111111111111111111111111111111111111112'
GROUP BY DATE(block_time), trader_id, token_bought_symbol, token_bought_mint_address
),

solana_sold AS (
    SELECT 
        DATE(block_time) AS trading_date,
        trader_id,
        token_sold_symbol,
        token_sold_mint_address,
        SUM(token_sold_amount) AS total_sold_sol_amount,
        SUM(amount_usd) AS total_sold_sol_amount_usd
    FROM dune.flamenco18.result_top_kols_trades
    WHERE
        DATE(block_time) = DATE_ADD('day', -1, CURRENT_DATE)
        AND token_sold_mint_address = 'So11111111111111111111111111111111111111112'
    GROUP BY DATE(block_time), trader_id, token_sold_symbol, token_sold_mint_address
),

top_wallets AS (
SELECT 
    kol_name,
    wallet_address
FROM query_4775362
)

SELECT 
    date_format(solana_bought.trading_date, '%d-%m-%Y') AS trading_date,
    top_wallets.wallet_address,
    top_wallets.kol_name,
    total_bought_sol_amount - total_sold_sol_amount  AS pnl_sol,
    total_bought_sol_amount_usd - total_sold_sol_amount_usd AS pnl_usd,
    (total_bought_sol_amount_usd - total_sold_sol_amount_usd) / total_sold_sol_amount_usd AS roi,
    total_sold_sol_amount,
    total_bought_sol_amount,
    total_sold_sol_amount_usd,
    total_bought_sol_amount_usd
FROM top_wallets
LEFT JOIN solana_bought
    ON solana_bought.trader_id = top_wallets.wallet_address
LEFT JOIN solana_sold
    ON solana_sold.trader_id = top_wallets.wallet_address
ORDER BY pnl_usd DESC