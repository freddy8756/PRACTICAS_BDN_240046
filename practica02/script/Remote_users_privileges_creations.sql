USE db_test_8b;

-- CREACIÓN DE USUARIOS
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'diego'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'osmar'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'damari'@'%' IDENTIFIED BY '1234';
CREATE USER IF NOT EXISTS 'marco.ramirez'@'%' IDENTIFIED BY '1234';

-- SUPER USUARIO
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- CREACIÓN DE ROLES
CREATE ROLE IF NOT EXISTS 'super_admin';
CREATE ROLE IF NOT EXISTS 'admin';
CREATE ROLE IF NOT EXISTS 'seller';
CREATE ROLE IF NOT EXISTS 'buyer';
CREATE ROLE IF NOT EXISTS 'support';
CREATE ROLE IF NOT EXISTS 'common';
CREATE ROLE IF NOT EXISTS 'user_not_registered';

-- PRIVILEGIOS DE SUPER ADMIN
GRANT ALL PRIVILEGES ON *.* TO 'super_admin' WITH GRANT OPTION;

/*Asignar privilegios a un usuario sin rol, esto no es una buena practica, pero es bueno saber que se puede realizar y no estar obligatoriamente ligado con el rol */
GRANT SELECT, INSERT, UPDATE, DELETE ON db_test_8b.tb_users TO 'aron'@'%';


-- PRIVILEGIOS DE SELLER
GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_8b.tb_products
TO 'seller';

-- PRIVILEGIOS DE SUPPORT
GRANT SELECT, INSERT, UPDATE
ON db_test_8b.tb_users
TO 'support';

-- ASIGNACIÓN DE ROLES
GRANT 'super_admin' TO 'root'@'%';
GRANT 'admin' TO 'marco.ramirez'@'%';
GRANT 'seller' TO 'diego'@'%';
GRANT 'support' TO 'osmar'@'%';
GRANT 'seller' TO 'damari'@'%';

-- ROLES POR DEFECTO
SET DEFAULT ROLE 'super_admin' TO 'root'@'%';
SET DEFAULT ROLE 'admin' TO 'marco.ramirez'@'%';
SET DEFAULT ROLE 'seller' TO 'diego'@'%';
SET DEFAULT ROLE 'support' TO 'osmar'@'%';
SET DEFAULT ROLE 'seller' TO 'damari'@'%';

FLUSH PRIVILEGES;