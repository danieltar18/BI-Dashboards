/* Query KOL Wallet transactions */
/* 1.) Gather Historical DEX trades */
WITH top_wallets AS (
SELECT 
    kol_name,
    twitter_address,
    telegram_address,
    wallet_address
FROM query_4775362
)

SELECT
  tx_id,
  '<a href=https://solscan.io/tx/' || tx_id || '>' || 'Solscan↗️' || '</a>' AS tx_link,
  trader_id,
  top_wallets.kol_name,
  blockchain,
  project,
  block_month,
  block_time,
  block_slot,
  trade_source,
  token_bought_symbol, 
  token_bought_mint_address,
  token_bought_amount,
  token_bought_vault,
  
  token_sold_symbol, 
  token_sold_mint_address,
  token_sold_amount,
  token_sold_vault,
  token_pair,
  amount_usd,
  fee_tier,
  fee_usd,
  project_program_id,
  project_main_id,
  tx_index
FROM dex_solana.trades AS dex_trades
INNER JOIN top_wallets AS top_wallets
    ON top_wallets.wallet_address = dex_trades.trader_id
WHERE
 DATE(block_time) = DATE_ADD('day', -1, CURRENT_DATE)
ORDER BY
  block_time DESC
