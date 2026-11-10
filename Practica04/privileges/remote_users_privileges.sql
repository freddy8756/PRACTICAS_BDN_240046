USE db_test_8b;

-- ==========================================
-- CREACIÓN DE USUARIOS
-- ==========================================

CREATE USER IF NOT EXISTS 'angeleutiquio.cruz'@'%' IDENTIFIED BY '1234';
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
-- PRIVILEGIOS USER_NOT_REGISTERED
-- ==========================================

-- Consultar productos
GRANT SELECT
ON db_test_8b.tb_products
TO 'user_not_registered';

GRANT SELECT
ON db_test_8b.tb_product_categorias
TO 'user_not_registered';

GRANT SELECT
ON db_test_8b.tbc_categorias
TO 'user_not_registered';

-- Crear carrito
GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tb_carts
TO 'user_not_registered';

-- Agregar productos al carrito
GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tbd_carts_items
TO 'user_not_registered';

-- Registrar direcciones
GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tb_user_addresses
TO 'user_not_registered';

GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tbd_address_components
TO 'user_not_registered';

-- Consultar métodos de pago disponibles
GRANT SELECT
ON db_test_8b.tbc_payment_methods
TO 'user_not_registered';

GRANT SELECT
ON db_test_8b.tbc_payment_methods_types
TO 'user_not_registered';

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

-- ==========================================
-- PRIVILEGIOS BUYER
-- ==========================================

-- Órdenes
GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tb_buyer_orders
TO 'buyer';

GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tbd_order_items
TO 'buyer';

-- Métodos de pago del usuario
GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tbd_user_payment_methods
TO 'buyer';

-- Pagos
GRANT SELECT, INSERT
ON db_test_8b.tb_payments
TO 'buyer';

-- Transacciones
GRANT SELECT
ON db_test_8b.tb_payment_transactions
TO 'buyer';

-- Envíos
GRANT SELECT
ON db_test_8b.tb_shipments
TO 'buyer';

-- Wishlist
GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tbd_users_wishlist_products
TO 'buyer';

-- Devoluciones
GRANT SELECT, INSERT
ON db_test_8b.tb_returns
TO 'buyer';

GRANT SELECT, INSERT
ON db_test_8b.tbd_return_items
TO 'buyer';

-- Cancelaciones
GRANT SELECT, INSERT
ON db_test_8b.tb_order_cancellations
TO 'buyer';

GRANT SELECT, INSERT
ON db_test_8b.tbd_cancellation_items
TO 'buyer';

-- Reseñas
GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tb_product_reviews
TO 'buyer';

GRANT SELECT, INSERT
ON db_test_8b.tb_buyer_orders
TO 'user_not_registered';

GRANT SELECT, INSERT
ON db_test_8b.tbd_user_payment_methods
TO 'user_not_registered';

FLUSH PRIVILEGES;