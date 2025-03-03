-- Static List, reference: https://kolscan.io/leaderboard
-- 2025-02-25 Top 25 wallet daily

SELECT 
    kol_name,
    twitter_address,
    telegram_address,
    wallet_address
FROM UNNEST(ARRAY[('Leens', 'https://x.com/leensx100', 'https://t.me/leenscooks', '7iabBMwmSvS4CFPcjW2XYZY53bUCHzXjCFEFhxeYP4CY'),
            ('West', 'https://x.com/ratwizardx', '', 'JDd3hy3gQn2V982mi1zqhNqUw1GfV2UL6g76STojCJPN'),
            ('Euris', 'https://x.com/Euris_JT', '', 'DfMxre4cKmvogbLrPigxmibVTTQDuzjdXojWzjCXXhzj'),
            ('Zrool', 'https://x.com/TheRealZrool', '', '99i9uVA7Q56bY22ajKKUfTZTgTeP5yCtVGsrG9J4pDYQ'),
            ('Tim', 'https://x.com/timmpix1', '', 'AJ6MGExeK7FXmeKkKPmALjcdXVStXYokYNv9uVfDRtvo'),
            ('AP', 'https://x.com/verybrickedup', '', '215nhcAHjQQGgwpQSJQ7zR26etbjjtVdW74NLzwEgQjP'),
            ('Gh0stee', 'https://x.com/4GH0STEE', '', '2kv8X2a9bxnBM8NKLc6BBTX2z13GFNRL4oRotMUJRva9'),
            ('Jerry', 'https://x.com/chefjerrry', 'https://t.me/jerrycabal', 'E33jP6RWVpGkv3fDVbuR5Ee6ak42tTKW9yYszqERtobs'),
            ('Orange', 'https://x.com/OrangeSBS', '', '96sErVjEN7LNJ6Uvj63bdRWZxNuBngj56fnT9biHLKBf'),
            ('Kreo', 'https://x.com/kreo444', '', 'BCnqsPEtA1TkgednYEebRpkmwFRJDCjMQcKZMMtEdArc'),
            ('TIL', 'https://x.com/tilcrypto', '', 'EHg5YkU2SZBTvuT87rUsvxArGp3HLeye1fXaSDfuMyaf'),
            ('Danny', 'https://x.com/cladzsol', '', 'EaVboaPxFCYanjoNWdkxTbPvt57nhXGu5i6m9m6ZS2kK'),
            ('Jijo', 'https://x.com/jijo_exe', 'https://t.me/jijosjournal', '4BdKaxN8G6ka4GYtQQWk4G4dZRUTX2vQH9GcXdBREFUk'),
            ('Cented', 'https://x.com/Cented7', '', 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o'),
            ('Jidn', 'https://x.com/jidn_w', 'https://t.me/JidnLosesMoney', '3h65MmPZksoKKyEpEjnWU2Yk2iYT5oZDNitGy5cTaxoE'),
            ('Waddles', 'https://x.com/waddles_eth', '', '73LnJ7G9ffBDjEBGgJDdgvLUhD5APLonKrNiHsKDCw5B'),
            ('Latuche', 'https://x.com/Latuche95', '', 'GJA1HEbxGnqBhBifH9uQauzXSB53to5rhDrzmKxhSU65'),
            ('404Flipped', 'https://x.com/404flipped', '', 'AbcX4XBm7DJ3i9p29i6sU8WLmiW4FWY5tiwB9D6UBbcE'),
            ('Frostyjays', 'https://x.com/FrostyJayss', '', 'HtucFepgUkMpHdrYsxMqjBNN6qVBdjmFaLZneNXopuJm'),
            ('Kev', 'https://x.com/Kevsznx', '', 'BTf4A2exGK9BCVDNzy65b9dUzXgMqB4weVkvTMFQsadd'),
            ('Al4n', 'https://x.com/Al4neu', '', '2YJbcB9G8wePrpVBcT31o8JEed6L3abgyCjt5qkJMymV'),
            ('Qtdegen', 'https://x.com/qtdegen', '', '7tiRXPM4wwBMRMYzmywRAE6jveS3gDbNyxgRrEoU6RLA'),
            ('Jalen', 'https://x.com/RipJalens', '', 'F72vY99ihQsYwqEDCfz7igKXA5me6vN2zqVsVUTpw6qL'),
            ('Meechie', 'https://x.com/973Meech', 'https://t.me/NotACallerChannel', '831qmkeGhfL8YpcXuhrug6nHj1YdK3aXMDQUCo85Auh1'),
            ('Daumen', 'https://x.com/daumeneth', '', '8MaVa9kdt3NW4Q5HyNAm1X5LbR8PQRVDc1W8NMVK88D5')
        
            
]) AS unnested_array(kol_name, twitter_address, telegram_address, wallet_address)