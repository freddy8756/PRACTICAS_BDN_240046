USE db_test_8b;

-- ==========================================
-- CREACIÓN DE USUARIOS
-- ==========================================

CREATE USER IF NOT EXISTS 'angeleutiquio.cruz'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'marco.ramirez'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'diego'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'damari'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'osmar'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'aron'@'%' IDENTIFIED BY '1234';

-- Middleware

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
-- SUPER ADMIN
-- ==========================================

GRANT ALL PRIVILEGES
ON *.*
TO 'super_admin'
WITH GRANT OPTION;

-- ==========================================
-- ADMIN
-- ==========================================

GRANT ALL PRIVILEGES
ON db_test_8b.*
TO 'admin';

-- ==========================================
-- SELLER
-- ==========================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tb_products
TO 'seller';

GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tbd_products_users_providers
TO 'seller';

GRANT SELECT
ON db_test_8b.tb_buyer_orders
TO 'seller';

GRANT SELECT
ON db_test_8b.tbd_buyer_orders_items
TO 'seller';

-- ==========================================
-- BUYER
-- ==========================================

-- Productos

GRANT SELECT
ON db_test_8b.tb_products
TO 'buyer';

-- Carritos

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tb_carts
TO 'buyer';

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tbc_carts_items
TO 'buyer';

-- Órdenes

GRANT SELECT, INSERT
ON db_test_8b.tb_buyer_orders
TO 'buyer';

GRANT SELECT, INSERT
ON db_test_8b.tbd_buyer_orders_items
TO 'buyer';

-- Direcciones

GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tb_user_addresses
TO 'buyer';

-- Métodos de pago

GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tbd_user_payment_methods
TO 'buyer';

-- Pagos

GRANT SELECT, INSERT
ON db_test_8b.tb_payments
TO 'buyer';

-- Wishlist

GRANT SELECT, INSERT, DELETE
ON db_test_8b.tbd_users_wishlist_products
TO 'buyer';

-- ==========================================
-- USER NOT REGISTERED
-- ==========================================

-- Registro de cuenta

GRANT INSERT
ON db_test_8b.tb_users
TO 'user_not_registered';

GRANT INSERT
ON db_test_8b.tb_people
TO 'user_not_registered';

-- Consulta catálogo

GRANT SELECT
ON db_test_8b.tb_products
TO 'user_not_registered';

-- Carrito

GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tb_carts
TO 'user_not_registered';

GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tbc_carts_items
TO 'user_not_registered';

-- Dirección

GRANT SELECT, INSERT
ON db_test_8b.tb_user_addresses
TO 'user_not_registered';

-- Métodos de pago

GRANT SELECT, INSERT
ON db_test_8b.tbd_user_payment_methods
TO 'user_not_registered';

-- Órdenes

GRANT SELECT, INSERT
ON db_test_8b.tb_buyer_orders
TO 'user_not_registered';

GRANT SELECT, INSERT
ON db_test_8b.tbd_buyer_orders_items
TO 'user_not_registered';

-- Pagos

GRANT SELECT, INSERT
ON db_test_8b.tb_payments
TO 'user_not_registered';

-- Procedimientos

GRANT EXECUTE
ON PROCEDURE db_test_8b.sp_insert_user
TO 'user_not_registered';

GRANT EXECUTE
ON PROCEDURE db_test_8b.sp_insert_person
TO 'user_not_registered';

-- ==========================================
-- SUPPORT
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

GRANT SELECT
ON db_test_8b.tb_buyer_orders
TO 'support';

GRANT SELECT
ON db_test_8b.tb_payments
TO 'support';

-- ==========================================
-- ARON (SIN ROL)
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

-- Middleware

GRANT 'user_not_registered' TO 'app_web'@'%';
GRANT 'user_not_registered' TO 'app_mobile'@'%';

-- ==========================================
-- ROLES POR DEFECTO
-- ==========================================

SET DEFAULT ROLE 'super_admin'
TO 'angeleutiquio.cruz'@'%';

-- NO MODIFICAR
SET DEFAULT ROLE 'admin'
TO 'marco.ramirez'@'%';

SET DEFAULT ROLE 'seller'
TO 'diego'@'%';

SET DEFAULT ROLE 'seller'
TO 'damari'@'%';

SET DEFAULT ROLE 'support'
TO 'osmar'@'%';

SET DEFAULT ROLE 'user_not_registered'
TO 'app_web'@'%';

SET DEFAULT ROLE 'user_not_registered'
TO 'app_mobile'@'%';

GRANT INSERT
ON db_test_8b.tbd_return_items
TO 'user_not_registered';

GRANT INSERT
ON db_test_8b.tb_returns
TO 'user_not_registered';

GRANT INSERT
ON db_test_8b.tbd_order_items
TO 'user_not_registered';

GRANT INSERT
ON db_test_8b.tb_order_cancellations
TO 'user_not_registered';
FLUSH PRIVILEGES;