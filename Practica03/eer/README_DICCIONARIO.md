# Diccionario de datos

> Documento generado automáticamente desde `schema.json`. Para actualizarlo, ejecuta `node generate-dictionary.mjs`.

## Información general

| Propiedad | Valor |
| --- | --- |
| Base de datos objetivo | db_test_8b |
| Bases declaradas | db_test_8b |
| Archivo fuente | respaldo_1410.sql |
| Estado del análisis | complete |
| Analizado en | 2026-11-13T16:47:17.718Z |
| Limitación | Lectura estática del respaldo; no se ejecutó SQL. |

## Estadísticas

| Métrica | Cantidad |
| --- | ---: |
| Tablas | 25 |
| Columnas | 192 |
| Tablas con clave primaria | 25 |
| Claves foráneas | 36 |
| Índices | 41 |
| Restricciones CHECK | 9 |
| Relaciones | 36 |
| Vistas | 25 |
| Triggers | 72 |
| Procedimientos almacenados | 24 |
| Filas indicadas por el esquema | 105922 |
| Sentencias analizadas | 1978 |

> Los conteos de filas corresponden a los valores registrados en el esquema; consulta las advertencias para conocer su alcance.

## Tablas y columnas

### `tb_buyer_orders`

- **Motor:** InnoDB
- **Filas reportadas:** 1
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `seller_ID` | `int` | No | `—` | FK → tb_users(ID) |
| 3 | `subtotal` | `decimal(12,2)` | No | `'0.00'` | — |
| 4 | `shipping_cost` | `decimal(12,2)` | No | `'0.00'` | — |
| 5 | `fulfillment_status` | `enum('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned')` | No | `'Pending'` | — |
| 6 | `status` | `bit(1)` | No | `b'1'` | — |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `tb_buyer_orders_ibfk_1` | `seller_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `seller_ID` | INDEX | `seller_ID` |

**Restricciones CHECK**

| Nombre | Expresión |
| --- | --- |
| `tb_buyer_orders_chk_1` | `(\`subtotal\`>=0)` |
| `tb_buyer_orders_chk_2` | `(\`shipping_cost\`>=0)` |

### `tb_carts`

- **Motor:** InnoDB
- **Filas reportadas:** 5
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `user_ID` | `int` | No | `—` | UNIQUE, FK → tb_users(ID) |
| 3 | `status` | `bit(1)` | Sí | `b'1'` | — |
| 4 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 5 | `last_update` | `datetime` | Sí | `NULL` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `tb_carts_ibfk_1` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_cart_user` | UNIQUE | `user_ID` |

### `tb_logs`

- **Motor:** InnoDB
- **Filas reportadas:** 71765
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `table_name` | `varchar(80)` | No | `—` | — |
| 3 | `table_operation` | `enum('Create','Read','Update','Delete')` | Sí | `NULL` | — |
| 4 | `db_user` | `varchar(80)` | No | `—` | — |
| 5 | `table_description` | `text` | No | `—` | — |
| 6 | `operation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 7 | `operation_status` | `bit(1)` | Sí | `b'1'` | — |
| 8 | `product_id` | `int` | Sí | `NULL` | — |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

_Sin índices adicionales._

### `tb_order_cancellations`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) |
| 3 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) |
| 4 | `cancellation_reason` | `varchar(500)` | No | `—` | — |
| 5 | `approval_status` | `enum('Pending','Approved','Rejected')` | No | `'Pending'` | — |
| 6 | `status` | `bit(1)` | No | `b'1'` | — |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_cancellation_order` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | — | — |
| `fk_cancellation_user` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_cancellation_order` | INDEX | `buyer_order_ID` |
| `fk_cancellation_user` | INDEX | `user_ID` |

### `tb_payment_transactions`

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `payment_ID` | `bigint unsigned` | No | `—` | FK → tb_payments(ID) |
| 3 | `transaction_code` | `varchar(100)` | No | `—` | — |
| 4 | `provider` | `varchar(60)` | No | `—` | — |
| 5 | `transaction_status` | `enum('Pending','Approved','Rejected','Canceled')` | No | `—` | — |
| 6 | `response_message` | `varchar(500)` | Sí | `NULL` | — |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_transaction_payment` | `payment_ID` | `tb_payments` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_transaction_payment` | INDEX | `payment_ID` |

### `tb_payments`

- **Motor:** InnoDB
- **Filas reportadas:** 3
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) |
| 3 | `payment_method_ID` | `bigint unsigned` | No | `—` | FK → tbd_user_payment_methods(ID) |
| 4 | `amount` | `decimal(12,2)` | No | `—` | — |
| 5 | `payment_status` | `enum('Pending','Approved','Rejected','Refunded')` | No | `'Pending'` | — |
| 6 | `status` | `bit(1)` | No | `b'1'` | — |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_payment_order` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | — | — |
| `fk_payment_user_method` | `payment_method_ID` | `tbd_user_payment_methods` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_payment_order` | INDEX | `buyer_order_ID` |
| `fk_payment_user_method` | INDEX | `payment_method_ID` |

### `tb_people`

- **Motor:** InnoDB
- **Filas reportadas:** 10005
- **Clave primaria:** `person_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `person_ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `user_ID` | `int` | Sí | `NULL` | UNIQUE, FK → tb_users(ID) |
| 3 | `courtesy_title` | `varchar(20)` | Sí | `NULL` | — |
| 4 | `given_names` | `varchar(150)` | No | `—` | — |
| 5 | `family_names` | `varchar(150)` | Sí | `NULL` | — |
| 6 | `birth_date` | `date` | Sí | `NULL` | — |
| 7 | `gender` | `enum('Hombre','Mujer','Prefiero no decirlo')` | No | `'Prefiero no decirlo'` | — |
| 8 | `country_code` | `char(2)` | Sí | `NULL` | — |
| 9 | `phone` | `varchar(25)` | Sí | `NULL` | — |
| 10 | `status` | `bit(1)` | Sí | `b'1'` | — |
| 11 | `creation_date` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |
| 12 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_people_users` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `user_ID` | UNIQUE | `user_ID` |

### `tb_product_categorias`

- **Motor:** InnoDB
- **Filas reportadas:** 7000
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `product_ID` | `int unsigned` | No | `—` | FK → tb_products(ID) |
| 3 | `category_ID` | `int unsigned` | No | `—` | FK → tbc_categorias(ID) |
| 4 | `status` | `bit(1)` | No | `b'1'` | — |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 6 | `last_update` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_product_categoria_categoria` | `category_ID` | `tbc_categorias` | `ID` | — | — |
| `fk_product_categoria_producto` | `product_ID` | `tb_products` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_product_categoria_producto` | INDEX | `product_ID` |
| `fk_product_categoria_categoria` | INDEX | `category_ID` |

### `tb_product_reviews`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `product_ID` | `int unsigned` | No | `—` | FK → tb_products(ID) |
| 3 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) |
| 4 | `rating` | `tinyint unsigned` | No | `—` | — |
| 5 | `review` | `text` | Sí | `—` | — |
| 6 | `status` | `bit(1)` | No | `b'1'` | — |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_review_product` | `product_ID` | `tb_products` | `ID` | — | — |
| `fk_review_user` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_review_product` | INDEX | `product_ID` |
| `fk_review_user` | INDEX | `user_ID` |

**Restricciones CHECK**

| Nombre | Expresión |
| --- | --- |
| `chk_rating` | `(\`rating\` between 1 and 5)` |

### `tb_products`

- **Motor:** InnoDB
- **Filas reportadas:** 7000
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `SKU` | `varchar(50)` | No | `—` | UNIQUE |
| 3 | `name` | `varchar(250)` | No | `—` | — |
| 4 | `description` | `text` | Sí | `—` | — |
| 5 | `current_price` | `decimal(10,2)` | No | `'0.00'` | — |
| 6 | `current_stock` | `int unsigned` | No | `'0'` | — |
| 7 | `status` | `tinyint(1)` | No | `'1'` | — |
| 8 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 9 | `last_update` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `SKU` | UNIQUE | `SKU` |

### `tb_returns`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) |
| 3 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) |
| 4 | `reason` | `varchar(500)` | No | `—` | — |
| 5 | `return_status` | `enum('Requested','Approved','Rejected','Completed')` | No | `'Requested'` | — |
| 6 | `status` | `bit(1)` | No | `b'1'` | — |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_return_order` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | — | — |
| `fk_return_user` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_return_order` | INDEX | `buyer_order_ID` |
| `fk_return_user` | INDEX | `user_ID` |

### `tb_shipments`

- **Motor:** InnoDB
- **Filas reportadas:** 1
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) |
| 3 | `address_ID` | `bigint unsigned` | No | `—` | FK → tb_user_addresses(ID) |
| 4 | `tracking_number` | `varchar(120)` | Sí | `NULL` | — |
| 5 | `carrier` | `varchar(100)` | Sí | `NULL` | — |
| 6 | `shipment_status` | `enum('Pending','Preparing','Shipped','Delivered','Lost','Returned')` | No | `'Pending'` | — |
| 7 | `shipped_date` | `datetime` | Sí | `NULL` | — |
| 8 | `delivered_date` | `datetime` | Sí | `NULL` | — |
| 9 | `status` | `bit(1)` | No | `b'1'` | — |
| 10 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 11 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_shipment_address` | `address_ID` | `tb_user_addresses` | `ID` | — | — |
| `fk_shipment_order` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_shipment_order` | INDEX | `buyer_order_ID` |
| `fk_shipment_address` | INDEX | `address_ID` |

### `tb_user_addresses`

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) |
| 3 | `address_label` | `varchar(100)` | No | `—` | — |
| 4 | `recipient_name` | `varchar(150)` | Sí | `NULL` | — |
| 5 | `recipient_phone` | `varchar(25)` | Sí | `NULL` | — |
| 6 | `delivery_instructions` | `varchar(500)` | Sí | `NULL` | — |
| 7 | `latitude` | `decimal(10,7)` | Sí | `NULL` | — |
| 8 | `longitude` | `decimal(10,7)` | Sí | `NULL` | — |
| 9 | `is_default` | `bit(1)` | No | `b'1'` | — |
| 10 | `status` | `bit(1)` | No | `b'1'` | — |
| 11 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 12 | `last_update` | `datetime` | Sí | `NULL` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_addresses_users` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `idx_user_addresses` | INDEX | `user_ID` |

**Restricciones CHECK**

| Nombre | Expresión |
| --- | --- |
| `chk_coordinates` | `(((\`latitude\` is null)and(\`longitude\` is null))or((\`latitude\` is not null)and(\`longitude\` is not null)))` |
| `chk_latitude` | `((\`latitude\` is null)or(\`latitude\` between-(90)and 90))` |
| `chk_longitude` | `((\`longitude\` is null)or(\`longitude\` between-(180)and 180))` |

### `tb_users`

- **Motor:** InnoDB
- **Filas reportadas:** 10015
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `email` | `varchar(100)` | No | `—` | UNIQUE |
| 3 | `nick` | `varchar(50)` | No | `—` | UNIQUE |
| 4 | `password` | `varchar(100)` | No | `—` | — |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 6 | `last_update` | `datetime` | Sí | `NULL` | — |
| 7 | `last_login` | `datetime` | Sí | `NULL` | — |
| 8 | `status` | `tinyint(1)` | No | `'1'` | — |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `email` | UNIQUE | `email` |
| `nick` | UNIQUE | `nick` |

### `tbc_categorias`

- **Motor:** InnoDB
- **Filas reportadas:** 100
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `name` | `varchar(120)` | No | `—` | UNIQUE |
| 3 | `description` | `text` | Sí | `—` | — |
| 4 | `sup_id_category` | `int unsigned` | Sí | `NULL` | FK → tbc_categorias(ID) |
| 5 | `status` | `bit(1)` | No | `b'1'` | — |
| 6 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 7 | `last_update` | `datetime` | No | `—` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_superior_category` | `sup_id_category` | `tbc_categorias` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `name` | UNIQUE | `name` |
| `fk_superior_category` | INDEX | `sup_id_category` |

### `tbc_payment_methods`

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `code` | `varchar(30)` | No | `—` | UNIQUE |
| 3 | `description` | `text` | No | `—` | — |
| 4 | `status` | `bit(1)` | No | `b'1'` | — |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 6 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_payment_code` | UNIQUE | `code` |

### `tbc_payment_methods_types`

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `name` | `varchar(100)` | No | `—` | UNIQUE |
| 3 | `description` | `text` | Sí | `—` | — |
| 4 | `status` | `bit(1)` | No | `b'1'` | — |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 6 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_payment_method_type_name` | UNIQUE | `name` |

### `tbd_address_components`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT, UNIQUE |
| 2 | `address_ID` | `bigint unsigned` | No | `—` | UNIQUE, FK → tb_user_addresses(ID), FK → tbd_address_components(address_ID, ID) |
| 3 | `value` | `varchar(255)` | No | `—` | — |
| 4 | `component_type` | `varchar(50)` | No | `—` | — |
| 5 | `status` | `bit(1)` | No | `b'1'` | — |
| 6 | `address_sup_ID` | `bigint unsigned` | Sí | `NULL` | FK → tbd_address_components(address_ID, ID) |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 8 | `last_update` | `datetime` | Sí | `NULL` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_component_address` | `address_ID` | `tb_user_addresses` | `ID` | RESTRICT | — |
| `fk_component_parent` | `address_ID`, `address_sup_ID` | `tbd_address_components` | `address_ID`, `ID` | RESTRICT | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_address_component` | UNIQUE | `address_ID`, `ID` |
| `idx_address_parent` | INDEX | `address_ID`, `address_sup_ID` |

### `tbd_cancellation_items`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `cancellation_ID` | `bigint unsigned` | No | `—` | FK → tb_order_cancellations(ID) |
| 3 | `order_item_ID` | `int unsigned` | No | `—` | FK → tbd_order_items(ID) |
| 4 | `quantity` | `int unsigned` | No | `—` | — |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_cancel_item_cancel` | `cancellation_ID` | `tb_order_cancellations` | `ID` | — | — |
| `fk_cancel_item_order` | `order_item_ID` | `tbd_order_items` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_cancel_item_cancel` | INDEX | `cancellation_ID` |
| `fk_cancel_item_order` | INDEX | `order_item_ID` |

### `tbd_carts_items`

- **Motor:** InnoDB
- **Filas reportadas:** 5
- **Clave primaria:** `cart_ID`, `provider_ID`, `product_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `cart_ID` | `int unsigned` | No | `—` | PK, FK → tb_carts(ID) |
| 2 | `provider_ID` | `int` | No | `—` | PK, FK → tb_users(ID) |
| 3 | `product_ID` | `int unsigned` | No | `—` | PK, FK → tb_products(ID) |
| 4 | `quantity` | `int unsigned` | No | `'1'` | — |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `tbd_carts_items_ibfk_1` | `cart_ID` | `tb_carts` | `ID` | — | — |
| `tbd_carts_items_ibfk_2` | `provider_ID` | `tb_users` | `ID` | — | — |
| `tbd_carts_items_ibfk_3` | `product_ID` | `tb_products` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `provider_ID` | INDEX | `provider_ID` |
| `product_ID` | INDEX | `product_ID` |

**Restricciones CHECK**

| Nombre | Expresión |
| --- | --- |
| `chk_cart_quantity` | `(\`quantity\`>0)` |

### `tbd_order_items`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `seller_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) |
| 3 | `product_ID` | `int unsigned` | No | `—` | FK → tb_products(ID) |
| 4 | `provider_ID` | `int` | No | `—` | FK → tb_users(ID) |
| 5 | `product_name` | `varchar(255)` | No | `—` | — |
| 6 | `quantity` | `int unsigned` | No | `—` | — |
| 7 | `unit_price` | `decimal(12,2)` | No | `—` | — |
| 8 | `subtotal` | `decimal(12,2)` | Sí | `—` | — |
| 9 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `tbd_order_items_ibfk_1` | `seller_order_ID` | `tb_buyer_orders` | `ID` | — | — |
| `tbd_order_items_ibfk_2` | `product_ID` | `tb_products` | `ID` | — | — |
| `tbd_order_items_ibfk_3` | `provider_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `seller_order_ID` | INDEX | `seller_order_ID` |
| `product_ID` | INDEX | `product_ID` |
| `provider_ID` | INDEX | `provider_ID` |

**Restricciones CHECK**

| Nombre | Expresión |
| --- | --- |
| `tbd_order_items_chk_1` | `(\`quantity\`>0)` |
| `tbd_order_items_chk_2` | `(\`unit_price\`>=0)` |

### `tbd_products_users_providers`

- **Motor:** InnoDB
- **Filas reportadas:** 10
- **Clave primaria:** `user_ID`, `product_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `user_ID` | `int` | No | `—` | PK, FK → tb_users(ID) |
| 2 | `product_ID` | `int unsigned` | No | `—` | PK, FK → tb_products(ID) |
| 3 | `type_ownership` | `enum('Owner','Reseller','Distributor')` | Sí | `NULL` | — |
| 4 | `status` | `bit(1)` | No | `b'1'` | — |
| 5 | `available_date` | `datetime` | No | `—` | — |
| 6 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 7 | `last_update` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_products2` | `product_ID` | `tb_products` | `ID` | — | — |
| `fk_user1` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_products2` | INDEX | `product_ID` |

### `tbd_return_items`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `return_ID` | `bigint unsigned` | No | `—` | FK → tb_returns(ID) |
| 3 | `order_item_ID` | `int unsigned` | No | `—` | FK → tbd_order_items(ID) |
| 4 | `quantity` | `int unsigned` | No | `—` | — |
| 5 | `observation` | `varchar(500)` | Sí | `NULL` | — |
| 6 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_return_item_order` | `order_item_ID` | `tbd_order_items` | `ID` | — | — |
| `fk_return_item_return` | `return_ID` | `tb_returns` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_return_item_return` | INDEX | `return_ID` |
| `fk_return_item_order` | INDEX | `order_item_ID` |

### `tbd_user_payment_methods`

- **Motor:** InnoDB
- **Filas reportadas:** 4
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT |
| 2 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) |
| 3 | `payment_method_type_ID` | `int unsigned` | No | `—` | FK → tbc_payment_methods(ID) |
| 4 | `provider` | `varchar(60)` | No | `—` | UNIQUE |
| 5 | `provider_method_ref` | `varchar(255)` | No | `—` | UNIQUE |
| 6 | `label` | `varchar(100)` | Sí | `NULL` | — |
| 7 | `last_four` | `char(4)` | Sí | `NULL` | — |
| 8 | `is_default` | `tinyint(1)` | No | `'0'` | — |
| 9 | `status` | `bit(1)` | No | `b'1'` | — |
| 10 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 11 | `last_update` | `datetime` | Sí | `NULL` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_payment_method_type` | `payment_method_type_ID` | `tbc_payment_methods` | `ID` | — | — |
| `fk_payment_user` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_provider_method` | UNIQUE | `provider`, `provider_method_ref` |
| `fk_payment_user` | INDEX | `user_ID` |
| `fk_payment_method_type` | INDEX | `payment_method_type_ID` |

### `tbd_users_wishlist_products`

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `user_ID`, `product_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos |
| ---: | --- | --- | :---: | --- | --- |
| 1 | `user_ID` | `int` | No | `—` | PK, FK → tb_users(ID) |
| 2 | `product_ID` | `int unsigned` | No | `—` | PK, FK → tb_products(ID) |
| 3 | `status` | `bit(1)` | No | `b'1'` | — |
| 4 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — |
| 5 | `last_update` | `datetime` | No | `—` | — |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_wishlist_product` | `product_ID` | `tb_products` | `ID` | — | — |
| `fk_wishlist_user` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_products3` | INDEX | `product_ID` |
| `fk_user2` | INDEX | `user_ID` |

## Relaciones

| Tabla origen | Columnas origen | Tabla destino | Columnas destino | Cardinalidad | Tipo | Nombre | Nota |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `tb_buyer_orders` | `seller_ID` | `tb_users` | `ID` | 1:N | declared | `tb_buyer_orders_ibfk_1` | — |
| `tb_carts` | `user_ID` | `tb_users` | `ID` | 1:1 | declared | `tb_carts_ibfk_1` | — |
| `tb_order_cancellations` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | 1:N | declared | `fk_cancellation_order` | — |
| `tb_order_cancellations` | `user_ID` | `tb_users` | `ID` | 1:N | declared | `fk_cancellation_user` | — |
| `tb_payment_transactions` | `payment_ID` | `tb_payments` | `ID` | 1:N | declared | `fk_transaction_payment` | — |
| `tb_payments` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | 1:N | declared | `fk_payment_order` | — |
| `tb_payments` | `payment_method_ID` | `tbd_user_payment_methods` | `ID` | 1:N | declared | `fk_payment_user_method` | — |
| `tb_people` | `user_ID` | `tb_users` | `ID` | 1:1 | declared | `fk_people_users` | — |
| `tb_product_categorias` | `category_ID` | `tbc_categorias` | `ID` | 1:N | declared | `fk_product_categoria_categoria` | — |
| `tb_product_categorias` | `product_ID` | `tb_products` | `ID` | 1:N | declared | `fk_product_categoria_producto` | — |
| `tb_product_reviews` | `product_ID` | `tb_products` | `ID` | 1:N | declared | `fk_review_product` | — |
| `tb_product_reviews` | `user_ID` | `tb_users` | `ID` | 1:N | declared | `fk_review_user` | — |
| `tb_returns` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | 1:N | declared | `fk_return_order` | — |
| `tb_returns` | `user_ID` | `tb_users` | `ID` | 1:N | declared | `fk_return_user` | — |
| `tb_shipments` | `address_ID` | `tb_user_addresses` | `ID` | 1:N | declared | `fk_shipment_address` | — |
| `tb_shipments` | `buyer_order_ID` | `tb_buyer_orders` | `ID` | 1:N | declared | `fk_shipment_order` | — |
| `tb_user_addresses` | `user_ID` | `tb_users` | `ID` | 1:N | declared | `fk_addresses_users` | — |
| `tbc_categorias` | `sup_id_category` | `tbc_categorias` | `ID` | 1:N | declared | `fk_superior_category` | — |
| `tbd_address_components` | `address_ID` | `tb_user_addresses` | `ID` | 1:N | declared | `fk_component_address` | — |
| `tbd_address_components` | `address_ID`, `address_sup_ID` | `tbd_address_components` | `address_ID`, `ID` | 1:N | declared | `fk_component_parent` | — |
| `tbd_cancellation_items` | `cancellation_ID` | `tb_order_cancellations` | `ID` | 1:N | declared | `fk_cancel_item_cancel` | — |
| `tbd_cancellation_items` | `order_item_ID` | `tbd_order_items` | `ID` | 1:N | declared | `fk_cancel_item_order` | — |
| `tbd_carts_items` | `cart_ID` | `tb_carts` | `ID` | 1:N | declared | `tbd_carts_items_ibfk_1` | — |
| `tbd_carts_items` | `provider_ID` | `tb_users` | `ID` | 1:N | declared | `tbd_carts_items_ibfk_2` | — |
| `tbd_carts_items` | `product_ID` | `tb_products` | `ID` | 1:N | declared | `tbd_carts_items_ibfk_3` | — |
| `tbd_order_items` | `seller_order_ID` | `tb_buyer_orders` | `ID` | 1:N | declared | `tbd_order_items_ibfk_1` | — |
| `tbd_order_items` | `product_ID` | `tb_products` | `ID` | 1:N | declared | `tbd_order_items_ibfk_2` | — |
| `tbd_order_items` | `provider_ID` | `tb_users` | `ID` | 1:N | declared | `tbd_order_items_ibfk_3` | — |
| `tbd_products_users_providers` | `product_ID` | `tb_products` | `ID` | 1:N | declared | `fk_products2` | — |
| `tbd_products_users_providers` | `user_ID` | `tb_users` | `ID` | 1:N | declared | `fk_user1` | — |
| `tbd_return_items` | `order_item_ID` | `tbd_order_items` | `ID` | 1:N | declared | `fk_return_item_order` | — |
| `tbd_return_items` | `return_ID` | `tb_returns` | `ID` | 1:N | declared | `fk_return_item_return` | — |
| `tbd_user_payment_methods` | `payment_method_type_ID` | `tbc_payment_methods` | `ID` | 1:N | declared | `fk_payment_method_type` | — |
| `tbd_user_payment_methods` | `user_ID` | `tb_users` | `ID` | 1:N | declared | `fk_payment_user` | — |
| `tbd_users_wishlist_products` | `product_ID` | `tb_products` | `ID` | 1:N | declared | `fk_wishlist_product` | — |
| `tbd_users_wishlist_products` | `user_ID` | `tb_users` | `ID` | 1:N | declared | `fk_wishlist_user` | — |

### Relaciones muchos a muchos

| Tabla de asociación | Lado izquierdo | Lado derecho |
| --- | --- | --- |
| `tbd_products_users_providers` | `tb_products` (`ID`) | `tb_users` (`ID`) |
| `tbd_users_wishlist_products` | `tb_products` (`ID`) | `tb_users` (`ID`) |

## Vistas

- `vw_total_products_by_category`
- `vw_trazabilidad_address_components`
- `vw_trazabilidad_buyer_orders`
- `vw_trazabilidad_cancellation_items`
- `vw_trazabilidad_carts`
- `vw_trazabilidad_carts_items`
- `vw_trazabilidad_categorias`
- `vw_trazabilidad_order_cancellations`
- `vw_trazabilidad_order_items`
- `vw_trazabilidad_payment_methods`
- `vw_trazabilidad_payment_methods_types`
- `vw_trazabilidad_payment_transactions`
- `vw_trazabilidad_payments`
- `vw_trazabilidad_people`
- `vw_trazabilidad_product_categorias`
- `vw_trazabilidad_product_reviews`
- `vw_trazabilidad_productos`
- `vw_trazabilidad_products_users_providers`
- `vw_trazabilidad_return_items`
- `vw_trazabilidad_returns`
- `vw_trazabilidad_shipments`
- `vw_trazabilidad_user_addresses`
- `vw_trazabilidad_user_payment_methods`
- `vw_trazabilidad_users_wishlist_products`
- `vw_trazabilidad_usuarios`

## Triggers

- `trg_tb_buyer_orders_after_insert`
- `trg_tb_buyer_orders_after_update`
- `trg_tb_buyer_orders_after_delete`
- `trg_tb_carts_after_insert`
- `trg_tb_carts_after_update`
- `trg_tb_carts_after_delete`
- `trg_tb_order_cancellations_after_insert`
- `trg_tb_order_cancellations_after_update`
- `trg_tb_order_cancellations_after_delete`
- `trg_tb_payment_transactions_after_insert`
- `trg_tb_payment_transactions_after_update`
- `trg_tb_payment_transactions_after_delete`
- `trg_tb_payments_after_insert`
- `trg_tb_payments_after_update`
- `trg_tb_payments_after_delete`
- `trg_tb_people_after_insert`
- `trg_tb_people_after_update`
- `trg_tb_people_after_delete`
- `trg_tb_product_categorias_insert`
- `trg_tb_product_categorias_update`
- `trg_tb_product_categorias_delete`
- `trg_tb_product_reviews_after_insert`
- `trg_tb_product_reviews_after_update`
- `trg_tb_product_reviews_after_delete`
- `trg_tb_products_after_insert`
- `trg_tb_products_after_update`
- `trg_tb_products_after_delete`
- `trg_tb_returns_after_insert`
- `trg_tb_returns_after_update`
- `trg_tb_returns_after_delete`
- `trg_tb_shipments_after_insert`
- `trg_tb_shipments_after_update`
- `trg_tb_shipments_after_delete`
- `trg_tb_user_addresses_after_insert`
- `trg_tb_user_addresses_after_update`
- `trg_tb_user_addresses_after_delete`
- `trg_users_after_insert`
- `trg_users_after_update`
- `trg_users_after_delete`
- `trg_tbc_categorias_after_insert`
- `trg_tbc_categorias_after_update`
- `trg_tbc_categorias_after_delete`
- `trg_tbc_payment_methods_after_insert`
- `trg_tbc_payment_methods_after_update`
- `trg_tbc_payment_methods_after_delete`
- `trg_tbc_payment_methods_types_after_insert`
- `trg_tbc_payment_methods_types_after_update`
- `trg_tbc_payment_methods_types_after_delete`
- `trg_tbd_address_components_after_insert`
- `trg_tbd_address_components_after_update`
- `trg_tbd_address_components_after_delete`
- `trg_tbd_cancellation_items_after_insert`
- `trg_tbd_cancellation_items_after_update`
- `trg_tbd_cancellation_items_after_delete`
- `trg_tbd_carts_items_after_insert`
- `trg_tbd_carts_items_after_update`
- `trg_tbd_carts_items_after_delete`
- `trg_tbd_order_items_after_insert`
- `trg_tbd_order_items_after_update`
- `trg_tbd_order_items_after_delete`
- `trg_tbd_products_users_providers_after_insert`
- `trg_tbd_products_users_providers_after_update`
- `trg_tbd_products_users_providers_after_delete`
- `trg_tbd_return_items_after_insert`
- `trg_tbd_return_items_after_update`
- `trg_tbd_return_items_after_delete`
- `trg_tbd_user_payment_methods_after_insert`
- `trg_tbd_user_payment_methods_after_update`
- `trg_tbd_user_payment_methods_after_delete`
- `trg_tbd_users_wishlist_products_after_insert`
- `trg_tbd_users_wishlist_products_after_update`
- `trg_tbd_users_wishlist_products_after_delete`

## Procedimientos almacenados

- `sp_generate_10_users`
- `sp_generate_2000_multinational_users`
- `sp_generate_5000_users_probability`
- `sp_generate_500_users`
- `sp_generate_age`
- `sp_generate_country`
- `sp_generate_email`
- `sp_generate_nick`
- `sp_generate_products`
- `sp_generate_status`
- `sp_insertar_1000_productos_categorias`
- `sp_insert_generated_user`
- `sp_insert_person`
- `sp_insert_user`
- `sp_random_age`
- `sp_random_country`
- `sp_random_email_domain`
- `sp_random_first_name`
- `sp_random_gender`
- `sp_random_last_name`
- `sp_random_status`
- `sp_register_new_user`
- `sp_restore_product`
- `sp_soft_delete_product`

## Advertencias del análisis

- Conteos de INSERT representan filas incluidas en el respaldo, no registros actuales ni estado final.
- El respaldo contiene definiciones de rutinas almacenadas; no se ejecutaron.

