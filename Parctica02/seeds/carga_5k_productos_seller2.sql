LOAD DATA LOCAL INFILE 'C:\Users\ti_la\Documents\PRACTICAS_BDN_240046\seed\carga_5k_productos_seller2.sql'
INTO TABLE tb_products
CHARACTER SET utf8mb4 FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(
    id,
    sku,
    name,
    description,
    current_price,
    current_stock,
    creation_date,
    last_update,
    @status
)
SET STATUS = IF(@status = '1',b'1', b'0';)