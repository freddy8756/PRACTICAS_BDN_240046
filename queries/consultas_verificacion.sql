USE db_test_8b;

/* 1. ¿Cuántas tablas existen en la base de datos db_test_8b? */
SHOW TABLES;

/* 2. ¿Cuántos triggers existen en la base de datos db_test_8b? */
SHOW TRIGGERS FROM db_test_8b;

/* 3. ¿Cuántos registros existen en la tabla users? */
SELECT COUNT(*) AS total_registros FROM tb_users;

/* 4. ¿Cuántos registros existen en la tabla bitácora? */
SELECT COUNT(*) AS total_registros FROM tb_logs;

/*5. Consultar todas las operaciones realizadas en la base de datos*/
SELECT * FROM tb_logs;

/*6. Verificar que los usuarios remotos hayan sido creados*/
SELECT User, Host FROM mysql.user WHERE Host = '%' AND account_locked = 'N';

/*7. Verificar los roles que fueron creados*/
SELECT User, Host FROM mysql.user WHERE Host = '%' AND account_locked = 'Y';

/*8. Verificar que usuario tienen que roles*/
SELECT TO_USER AS usuario, TO_HOST AS host, FROM_USER AS rol, FROM_HOST AS rol_host FROM mysql.role_edges ORDER BY TO_USER, FROM_USER;

/*9. Verificar es total de procedimientos almacenados que existen en la base de datos*/
SHOW PROCEDURE STATUS WHERE Db = 'db_test_8b';

select
u.nick,
u.email,
b.db_user as inserted_by,
group_concat(
distinct re.from_user
order by re.from_user
separator','
)as roles,
b.operation_description,
b.operation_date
from tb_users u 
join tb_logs b
on b.operation_description like concat('%',u.nick,'%')
and b.operation_description like concat('%',u.email,'%')

left join mysql.role_edges re
on re.TO_USER = substring_index(b.db_user,'@',1)

where b.table_operation ='create'
and b.table_name ='tb_users'

group by 
u.nick,
u.email,
b.db_user,
b.operation_description,
b.operation_date
order by b.operation_date asc;

/*La modificacion de productos*/
/*CONTABILIZAR LOS PRODUCTOS*/
SELECT COUNT(*) from tb_products;

/*visualizar todos los productos*/
select * from tb_products;

/*consulta para saber la trazabilidad de los productos*/
select
p.id,
p.name,
p.description,
b.db_user as inserted_by,
COALESCE(
group_concat(
distinct re.from_user
order by re.from_user
separator','
),
'sin rol'
)as roles,

b.operation_description,
b.operation_date

from tb_products p 

join tb_logs b
on b.operation_description like concat('%ID=',p.id,',%')

left join mysql.role_edges re
on re.TO_USER = substring_index(b.db_user,'@',1)

where b.table_operation ='create'
and b.table_name ='tb_products'

group by 
p.id,
p.name,
p.description,
b.db_user,
b.operation_description,
b.operation_date
order by b.operation_date asc;