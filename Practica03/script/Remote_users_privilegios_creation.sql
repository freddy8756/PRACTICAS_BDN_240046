USE db_test_8b;

-- ==========================================
-- CREACIÓN DE USUARIOS
-- ==========================================

CREATE USER IF NOT EXISTS 'angeleutiquio.cruz'IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'diego'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'osmar'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'damari'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'marco.ramirez'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'aron'@'%' IDENTIFIED BY '1234';

-- ==========================================
-- CREACIÓN DE midelwer
-- ==========================================

CREATE USER IF NOT EXISTS 'app_web'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'app_mobile'@'%' IDENTIFIED BY '1234';

-- ==========================================
-- CREACIÓN DE ROLES
-- ==========================================

CREATE ROLE IF NOT EXISTS 'super_admin';
CREATE ROLE IF NOT EXISTS 'admin';
CREATE ROLE IF NOT EXISTS 'seller';
CREATE ROLE IF NOT EXISTS 'buyer';
CREATE ROLE IF NOT EXISTS 'support';
CREATE ROLE IF NOT EXISTS 'common';
CREATE ROLE IF NOT EXISTS 'user_not_registered';

-- ==========================================
-- PRIVILEGIOS SUPER ADMIN
-- ==========================================

GRANT ALL PRIVILEGES ON *.* TO 'super_admin' WITH GRANT OPTION;

-- ==========================================
-- PRIVILEGIOS SELLER
-- ==========================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tb_products
TO 'seller';
-- ==========================================
-- PRIVILEGIOS buyer
-- ==========================================

-- ==========================================
-- PRIVILEGIOS NO REGISTRADO
-- ==========================================
GRANT INSERT 
ON db_test_8b.tb_users 
TO 'user_not_registered';

GRANT insert 
ON db_test_8b.tb_people 
TO 'user_not_registered';

grant execute on 
procedure db_test_8b.sp_insert_user 
to 'user_not_registered';
-- ==========================================
-- PRIVILEGIOS SUPPORT
-- ==========================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tb_users
TO 'support';

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tbc_categorias
TO 'support';

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tb_product_categorias
TO 'support';

-- ==========================================
-- USUARIO SIN ROL (ARON)
-- ==========================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tb_users
TO 'aron'@'%';

-- ==========================================
-- ASIGNACIÓN DE ROLES
-- ==========================================

GRANT 'super_admin' TO 'angeleutiquio.cruz'@'%';

-- NO MODIFICAR
GRANT 'admin' TO 'marco.ramirez'@'%';

GRANT 'seller' TO 'diego'@'%';
GRANT 'seller' TO 'damari'@'%';

GRANT 'support' TO 'osmar'@'%';
-- ==========================================
-- ROLES de midelwer
-- ==========================================
GRANT 'user_not_registered' TO 'app_web'@'%';
GRANT 'user_not_registered' TO 'app_mobile'@'%';

-- ==========================================
-- ROLES POR DEFECTO
-- ==========================================

SET DEFAULT ROLE 'super_admin' TO 'angeleutiquio.cruz'@'%';

-- NO MODIFICAR
SET DEFAULT ROLE 'admin' TO 'marco.ramirez'@'%';

SET DEFAULT ROLE 'seller' TO 'diego'@'%';
SET DEFAULT ROLE 'seller' TO 'damari'@'%';

SET DEFAULT ROLE 'support' TO 'osmar'@'%';

-- ==========================================
-- ROLES POR DEFECTO de midelwer
-- ==========================================
SET DEFAULT ROLE 'user_not_registered' TO 'app_web'@'%';
SET DEFAULT ROLE 'user_not_registered' TO 'app_mobile'@'%';


FLUSH PRIVILEGES;