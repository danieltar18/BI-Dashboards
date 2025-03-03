SELECT 
    kol_name,
    wallet_address,
    '<a href="' || twitter_address || '" target="_blank" rel="noopener noreferrer">' || '𝕏' || '</a>' AS twitter_address,
    CASE 
        WHEN telegram_address IS NOT NULL AND telegram_address != '' THEN 
            '<a href="' || telegram_address || '" target="_blank" rel="noopener noreferrer">' || 'Telegram' || '</a>'
        ELSE '' 
    END AS telegram_address
FROM query_4775362
ORDER BY 1
