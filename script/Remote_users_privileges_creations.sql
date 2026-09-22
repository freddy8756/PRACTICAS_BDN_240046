-- ============================================================
-- CREACIÓN DE USUARIOS
-- ============================================================

CREATE USER IF NOT EXISTS 'angel.cruz'@'%' IDENTIFIED BY '240046';

CREATE USER IF NOT EXISTS 'nombre.apellido'@'%' IDENTIFIED BY '5656';

CREATE USER IF NOT EXISTS 'sam.cs'@'%' IDENTIFIED BY '240836';

CREATE USER IF NOT EXISTS 'usuarios.do'@'%' IDENTIFIED BY '5646';

create user if not exists 'doc.dac'@'%' IDENTIFIED BY '565566';


-- ============================================================
-- SUPER USUARIO
-- SOLO PARA DIEGO
-- ============================================================

GRANT ALL PRIVILEGES ON *.* TO 'angel.cruz'@'%'WITH GRANT OPTION;


-- ============================================================
-- CREACIÓN DE ROLES
-- ============================================================

CREATE ROLE IF NOT EXISTS 'super_admin';

CREATE ROLE IF NOT EXISTS 'admin';

CREATE ROLE IF NOT EXISTS 'seller';

CREATE ROLE IF NOT EXISTS 'buyer';

CREATE ROLE IF NOT EXISTS 'support';

CREATE ROLE IF NOT EXISTS 'common';

CREATE ROLE IF NOT EXISTS 'user_not_registered';


-- ============================================================
-- PRIVILEGIOS DE SUPER ADMIN
-- ============================================================

GRANT ALL PRIVILEGES ON *.* TO 'super_admin'WITH GRANT OPTION;


-- ============================================================
-- PRIVILEGIOS DE SELLER
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tb_products
TO 'seller';


-- ============================================================
-- PRIVILEGIOS DE SUPPORT
-- ============================================================

GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_users
TO 'support';

GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_products TO 'support';


-- ============================================================
-- ASIGNACIÓN DE ROLES
-- ============================================================

GRANT 'super_admin' TO 'angel.cruz'@'%';

GRANT 'seller' TO 'nombre.apellido'@'%';

GRANT 'support' TO 'sam.cs'@'%';

grant 'seller' to 'doc.dac'@'%';


-- ============================================================
-- ROLES POR DEFECTO
-- ============================================================

SET DEFAULT ROLE 'super_admin' TO 'angel.cruz'@'%';

SET DEFAULT ROLE 'seller' TO 'nombre.apellido'@'%';

SET DEFAULT ROLE 'support' TO 'sam.cs'@'%';

set default role 'seller' to 'doc.dac'@'%';


-- ============================================================
-- VERIFICACIÓN DE PRIVILEGIOS
-- ============================================================

SHOW GRANTS FOR 'angel.cruz'@'%';

SHOW GRANTS FOR 'nombre.apellido'@'%';

SHOW GRANTS FOR 'sam.cs'@'%';

SHOW GRANTS FOR 'nombre.apellido'@'%';

SHOW GRANTS FOR 'super_admin';

SHOW GRANTS FOR 'seller';

SHOW GRANTS FOR 'support';

select "los usuarios y privilegios an sido creados correctamente" as mensaje;