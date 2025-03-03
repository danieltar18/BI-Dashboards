/* SOL-MemeCoin transactions */

WITH token_pairs_agg AS (
    SELECT 
        CASE WHEN token_bought_mint_address = 'So11111111111111111111111111111111111111112' THEN token_sold_mint_address
        ELSE token_bought_mint_address END AS token_address,
        CASE WHEN token_bought_mint_address = 'So11111111111111111111111111111111111111112' THEN token_sold_symbol
        ELSE token_bought_symbol END AS token_symbol,
        COUNT(DISTINCT trader_id) AS unique_kols,
        COUNT(DISTINCT tx_id) AS txs,
        SUM(amount_usd) AS volume_usd
    FROM dune.flamenco18.result_top_kols_trades
    WHERE
        token_pair LIKE '%SOL%'
    GROUP BY 1,2
),

solana_sold AS (-- Selling Solana for MemeCoin -> sell SOL, buy MemeCoin
    SELECT 
        token_bought_mint_address AS token_address,
        token_bought_symbol AS token_symbol,
        SUM(token_sold_amount) AS total_sold_sol_amount,
        SUM(amount_usd) AS total_sold_sol_amount_usd
    FROM dune.flamenco18.result_top_kols_trades
    WHERE
        DATE(block_time) = DATE_ADD('day', -1, CURRENT_DATE)
        AND token_sold_mint_address = 'So11111111111111111111111111111111111111112'
    GROUP BY 1,2
),

solana_bought AS ( --Selling MemeCoin -> buying SOL
    SELECT 
        token_sold_mint_address AS token_address,
        token_sold_symbol AS token_symbol,
        
        SUM(token_bought_amount) AS total_bought_sol_amount,
        SUM(amount_usd) AS total_bought_sol_amount_usd
    FROM dune.flamenco18.result_top_kols_trades
    WHERE
            DATE(block_time) = DATE_ADD('day', -1, CURRENT_DATE)
        AND token_bought_mint_address = 'So11111111111111111111111111111111111111112'
    GROUP BY 1,2
),

time_invested AS ( 
    SELECT 
        CASE WHEN token_bought_mint_address = 'So11111111111111111111111111111111111111112' THEN token_sold_mint_address
        ELSE token_bought_mint_address END AS token_address,
        CASE WHEN token_bought_mint_address = 'So11111111111111111111111111111111111111112' THEN token_sold_symbol
        ELSE token_bought_symbol END AS token_symbol,
        trader_id,
        MIN(block_time) AS first_interaction_with_token,
        MAX(block_time) AS latest_interaction_with_token,
        DATE_DIFF('SECOND', MIN(block_time),  MAX(block_time)) AS time_spent_sec
    FROM dune.flamenco18.result_top_kols_trades
    WHERE
        token_pair LIKE '%SOL%'
    GROUP BY 1,2,3
),

time_invested_agg AS (
    SELECT 
        token_address,
        MIN(first_interaction_with_token) AS first_kol_interaction_with_token,
        AVG(time_spent_sec) AS avg_time_spent_second
    FROM time_invested
    GROUP BY 1
),

token_data AS (
    SELECT 
        token_mint_address,
        name,
        symbol,
        created_at
    FROM tokens_solana.fungible
    WHERE
        DATE(created_at) = DATE_ADD('day', -1, CURRENT_DATE)

)



SELECT
    '<a href=https://birdeye.so/token/' || cast(token_pairs_agg.token_address as varchar) || '?chain=solana' ||' target=_blank">' || cast('🔗' as varchar)  || '</a>' as birdeye, 
    '<a href=https://dexscreener.com/solana/' || cast(token_pairs_agg.token_address as varchar) || ' target=_blank">' || cast('🔗' as varchar)  || '</a>' as dexscreener, 
    '<a href=https://rugcheck.xyz/tokens/' || cast(token_pairs_agg.token_address as varchar) ||' target=_blank">' || cast('🔗' as varchar) || '</a>' as rugcheck,
    token_pairs_agg.token_symbol,
    token_data.name AS token_name,
    token_pairs_agg.unique_kols,
    token_pairs_agg.txs,   
    total_bought_sol_amount - total_sold_sol_amount  AS pnl_sol,
    total_bought_sol_amount_usd - total_sold_sol_amount_usd AS pnl_usd,
    (total_bought_sol_amount_usd - total_sold_sol_amount_usd) / total_sold_sol_amount_usd AS roi,
    total_sold_sol_amount / unique_kols AS avg_SOL_invested_per_KOL,
    total_sold_sol_amount_usd / unique_kols AS avg_SOL_USD_invested_per_KOL,
    
    total_bought_sol_amount / unique_kols AS avg_SOL_returned_per_KOL,
    total_bought_sol_amount_usd / unique_kols AS avg_SOL_USD_returned_per_KOL,

    token_data.created_at AS token_created_at,
    time_invested_agg.first_kol_interaction_with_token,
    time_invested_agg.avg_time_spent_second,
    
    token_pairs_agg.volume_usd,
    token_pairs_agg.token_address,

    -- SOLANA Perspective - Bought means selling Memecoin, buying SOL
    total_sold_sol_amount,
    total_bought_sol_amount,
    total_sold_sol_amount_usd,
    total_bought_sol_amount_usd
FROM token_pairs_agg
LEFT JOIN solana_sold
    ON solana_sold.token_address = token_pairs_agg.token_address
LEFT JOIN solana_bought
    ON solana_bought.token_address = token_pairs_agg.token_address
LEFT JOIN time_invested_agg
    ON time_invested_agg.token_address = token_pairs_agg.token_address
LEFT JOIN token_data
    ON token_data.token_mint_address = token_pairs_agg.token_address
WHERE
    token_pairs_agg.token_address != 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' --USDC COIN 
    AND token_pairs_agg.token_address != 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' --USDT COIN 
    AND token_pairs_agg.token_address != 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr' --EURC
ORDER BY pnl_usd DESC