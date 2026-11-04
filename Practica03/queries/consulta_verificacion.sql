USE db_test_8b;

/*cuantas tablas tenemos*/
SHOW TABLES;

/*Cunatos triggers tenemos*/
SHOW TRIGGERS FROM db_test_8b;

/* total de productos*/
select count(*) From tb_products;

select count(*) From tbc_categorias;

SELECT * FROM vw_trazabilidad_categorias;
SELECT * FROM vw_trazabilidad_productos;
select * FROM vw_trazabilidad_product_categorias;

/*contabilizar cuantos productos se categoria*/

SELECT category_ID, category_path, category_level, total_products, total_active_products, total_uncategorized_products FROM vw_total_products_by_category ORDER BY category_path;

/*correciones de categorias

/*eliminar todas las categorias*/

/*eliminar las autoreferencias para poder eliminar los registros de la tabla*/
SET SQL_SAFE_UPDATES = 0;

UPDATE tbc_categorias
SET sup_id_category = NULL;

SET SQL_SAFE_UPDATES = 1;
/**/
SET SQL_SAFE_UPDATES = 0;
DELETE FROM tb_product_categorias;
/**/
delete from tb_logs where table_name="tb_product_categorias"; 

/**/
alter TABLE tbc_categorias auto_increment=1;
/**/
select count(*) From tbc_categorias;
select count(*)from tb_logs where table_name="tb_product_categorias";
CREATE OR REPLACE VIEW vw_trazabilidad_productos AS
SELECT
    db_user AS inserted_by,
    table_operation AS operation,
    operation_date,
    table_description AS description
FROM tb_logs
WHERE table_name = 'tb_products'
ORDER BY operation_date DESC;
SELECT *
FROM vw_trazabilidad_productos;*/