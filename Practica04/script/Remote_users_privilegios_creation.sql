USE db_test_8b;

-- ==========================================
-- 1. CREACIÓN DE USUARIOS
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
-- 2. CREACIÓN DE ROLES
-- ==========================================
CREATE ROLE IF NOT EXISTS 'super_admin';
CREATE ROLE IF NOT EXISTS 'admin';
CREATE ROLE IF NOT EXISTS 'seller';
CREATE ROLE IF NOT EXISTS 'buyer';
CREATE ROLE IF NOT EXISTS 'support';
CREATE ROLE IF NOT EXISTS 'common';
CREATE ROLE IF NOT EXISTS 'user_not_registered';

-- ==========================================
-- 3. PRIVILEGIOS POR ROL
-- ==========================================

-- SUPER ADMIN
GRANT ALL PRIVILEGES ON *.* TO 'super_admin' WITH GRANT OPTION;

-- ADMIN
GRANT ALL PRIVILEGES ON db_test_8b.* TO 'admin';

-- SELLER
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tb_products TO 'seller';
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tbd_products_users_providers TO 'seller';
GRANT SELECT, UPDATE ON db_test_8b.tb_buyer_orders TO 'seller';
GRANT SELECT ON db_test_8b.tbd_order_items TO 'seller';
GRANT INSERT ON db_test_8b.tb_logs TO 'seller';

-- BUYER (Privilegios completos para los 5 Casos de Prueba)
GRANT SELECT, UPDATE ON db_test_8b.tb_products TO 'buyer';
GRANT SELECT ON db_test_8b.tbc_categorias TO 'buyer';
GRANT SELECT ON db_test_8b.tb_product_categorias TO 'buyer';
GRANT SELECT ON db_test_8b.tbd_products_users_providers TO 'buyer';
GRANT SELECT ON db_test_8b.tb_users TO 'buyer';
GRANT SELECT ON db_test_8b.tb_people TO 'buyer';

-- Carritos (Nombre real: tbd_carts_items)
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tb_carts TO 'buyer';
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tbd_carts_items TO 'buyer';

-- Órdenes (Nombre real: tbd_order_items)
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_buyer_orders TO 'buyer';
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tbd_order_items TO 'buyer';

-- Direcciones y Métodos de Pago
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_user_addresses TO 'buyer';
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tbd_user_payment_methods TO 'buyer';
GRANT SELECT ON db_test_8b.tbc_payment_methods TO 'buyer';
GRANT SELECT ON db_test_8b.tbc_payment_methods_types TO 'buyer';

-- Pagos y Transacciones
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_payments TO 'buyer';
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_payment_transactions TO 'buyer';

-- Envíos, Devoluciones y Cancelaciones (Casos 2, 3, 4 y 5)
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_shipments TO 'buyer';
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_returns TO 'buyer';
GRANT SELECT, INSERT ON db_test_8b.tbd_return_items TO 'buyer';
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_order_cancellations TO 'buyer';
GRANT SELECT, INSERT ON db_test_8b.tbd_cancellation_items TO 'buyer';

-- Wishlist y Auditoría
GRANT SELECT, INSERT, DELETE ON db_test_8b.tbd_users_wishlist_products TO 'buyer';
GRANT INSERT ON db_test_8b.tb_logs TO 'buyer';

-- USER NOT REGISTERED (Navegación, registro y flujo previo al pago)
GRANT SELECT, INSERT ON db_test_8b.tb_users TO 'user_not_registered';
GRANT SELECT, INSERT ON db_test_8b.tb_people TO 'user_not_registered';
GRANT SELECT ON db_test_8b.tb_products TO 'user_not_registered';
GRANT SELECT ON db_test_8b.tbc_categorias TO 'user_not_registered';
GRANT SELECT ON db_test_8b.tb_product_categorias TO 'user_not_registered';
GRANT SELECT ON db_test_8b.tbd_products_users_providers TO 'user_not_registered';

GRANT SELECT, INSERT, UPDATE ON db_test_8b.tb_carts TO 'user_not_registered';
GRANT SELECT, INSERT, UPDATE ON db_test_8b.tbd_carts_items TO 'user_not_registered';

GRANT SELECT, INSERT ON db_test_8b.tb_user_addresses TO 'user_not_registered';
GRANT SELECT, INSERT ON db_test_8b.tbd_user_payment_methods TO 'user_not_registered';
GRANT SELECT ON db_test_8b.tbc_payment_methods TO 'user_not_registered';
GRANT SELECT ON db_test_8b.tbc_payment_methods_types TO 'user_not_registered';

GRANT SELECT, INSERT ON db_test_8b.tb_buyer_orders TO 'user_not_registered';
GRANT SELECT, INSERT ON db_test_8b.tbd_order_items TO 'user_not_registered';
GRANT SELECT, INSERT ON db_test_8b.tb_payments TO 'user_not_registered';
GRANT INSERT ON db_test_8b.tb_logs TO 'user_not_registered';

-- SUPPORT
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tb_users TO 'support';
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tbc_categorias TO 'support';
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tb_product_categorias TO 'support';
GRANT SELECT, UPDATE ON db_test_8b.tb_buyer_orders TO 'support';
GRANT SELECT, UPDATE ON db_test_8b.tb_payments TO 'support';
GRANT SELECT, UPDATE ON db_test_8b.tb_returns TO 'support';
GRANT SELECT, UPDATE ON db_test_8b.tb_order_cancellations TO 'support';
GRANT INSERT ON db_test_8b.tb_logs TO 'support';

-- ARON (SIN ROL - Privilegios directos)
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tb_users TO 'aron'@'%';

-- ==========================================
-- 4. ASIGNACIÓN DE ROLES A USUARIOS
-- ==========================================
GRANT 'super_admin' TO 'angeleutiquio.cruz'@'%';

-- NO MODIFICAR
GRANT 'admin' TO 'marco.ramirez'@'%';
GRANT 'seller' TO 'diego'@'%';
GRANT 'seller' TO 'damari'@'%';
GRANT 'support' TO 'osmar'@'%';

-- Middleware (Se asignan AMBOS roles para que puedan cambiar a 'buyer' al pagar)
GRANT 'user_not_registered', 'buyer' TO 'app_web'@'%';
GRANT 'user_not_registered', 'buyer' TO 'app_mobile'@'%';

-- ==========================================
-- 5. ROLES POR DEFECTO
-- ==========================================
SET DEFAULT ROLE 'super_admin' TO 'angeleutiquio.cruz'@'%';

-- NO MODIFICAR
SET DEFAULT ROLE 'admin' TO 'marco.ramirez'@'%';
SET DEFAULT ROLE 'seller' TO 'diego'@'%';
SET DEFAULT ROLE 'seller' TO 'damari'@'%';
SET DEFAULT ROLE 'support' TO 'osmar'@'%';

-- Middleware inicia siempre como no registrado
SET DEFAULT ROLE 'user_not_registered' TO 'app_web'@'%';
SET DEFAULT ROLE 'user_not_registered' TO 'app_mobile'@'%';

FLUSH PRIVILEGES;

/**/