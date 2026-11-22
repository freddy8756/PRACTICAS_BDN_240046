# Diccionario de datos

> Documento generado automáticamente desde `schema.json`. Para actualizarlo, ejecuta `node generate-dictionary.mjs`.

## Información general

| Propiedad | Valor |
| --- | --- |
| Base de datos objetivo | db_test_8b |
| Bases declaradas | db_test_8b |
| Archivo fuente | respaldo_1410.sql |
| Estado del análisis | complete |
| Analizado en | 2026-11-22T01:58:11.449Z |
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
| Vistas | 23 |
| Triggers | 72 |
| Procedimientos almacenados | 24 |
| Filas indicadas por el esquema | 106134 |
| Sentencias analizadas | 1949 |

> Los conteos de filas corresponden a los valores registrados en el esquema; consulta las advertencias para conocer su alcance.

## Tablas y columnas

### `tb_buyer_orders`

Registra las órdenes de compra realizadas por los compradores, con sus importes y estados.

- **Motor:** InnoDB
- **Filas reportadas:** 6
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_buyer_orders. |
| 2 | `seller_ID` | `int` | No | `—` | FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 3 | `subtotal` | `decimal(12,2)` | No | `'0.00'` | — | Importe de los artículos de la orden antes de agregar el costo de envío. |
| 4 | `shipping_cost` | `decimal(12,2)` | No | `'0.00'` | — | Importe cobrado por el envío de la orden. |
| 5 | `fulfillment_status` | `enum('Pending','Accepted','Preparing','Sent','Delivered','Canceled','Returned')` | No | `'Pending'` | — | Estado del proceso de preparación y cumplimiento de la orden. |
| 6 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

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

Representa el carrito de compra asociado a un usuario.

- **Motor:** InnoDB
- **Filas reportadas:** 11
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_carts. |
| 2 | `user_ID` | `int` | No | `—` | UNIQUE, FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 3 | `status` | `bit(1)` | Sí | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 4 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 5 | `last_update` | `datetime` | Sí | `NULL` | — | Fecha y hora de la última modificación del registro. |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `tb_carts_ibfk_1` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_cart_user` | UNIQUE | `user_ID` |

### `tb_logs`

Almacena el historial de operaciones registradas sobre las tablas de la base de datos.

- **Motor:** InnoDB
- **Filas reportadas:** 71871
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_logs. |
| 2 | `table_name` | `varchar(80)` | No | `—` | — | Nombre de la tabla sobre la que se realizó la operación registrada. |
| 3 | `table_operation` | `enum('Create','Read','Update','Delete')` | Sí | `NULL` | — | Tipo de operación realizada sobre la tabla, por ejemplo INSERT, UPDATE o DELETE. |
| 4 | `db_user` | `varchar(80)` | No | `—` | — | Usuario de base de datos que ejecutó la operación. |
| 5 | `table_description` | `text` | No | `—` | — | Descripción del registro o de la operación guardada en la bitácora. |
| 6 | `operation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que ocurrió la operación registrada. |
| 7 | `operation_status` | `bit(1)` | Sí | `b'1'` | — | Resultado o estado de la operación registrada. |
| 8 | `product_id` | `int` | Sí | `NULL` | — | Identificador del producto relacionado con el evento de bitácora. |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

_Sin índices adicionales._

### `tb_order_cancellations`

Registra solicitudes de cancelación asociadas a una orden y al usuario que la solicita.

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_order_cancellations. |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) | Identificador del registro relacionado en tb_buyer_orders (ID). |
| 3 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 4 | `cancellation_reason` | `varchar(500)` | No | `—` | — | Motivo indicado para solicitar la cancelación. |
| 5 | `approval_status` | `enum('Pending','Approved','Rejected')` | No | `'Pending'` | — | Estado de aprobación o rechazo de la solicitud de cancelación. |
| 6 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |

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

Guarda las transacciones y respuestas del proveedor de pago para cada pago.

- **Motor:** InnoDB
- **Filas reportadas:** 13
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_payment_transactions. |
| 2 | `payment_ID` | `bigint unsigned` | No | `—` | FK → tb_payments(ID) | Identificador del registro relacionado en tb_payments (ID). |
| 3 | `transaction_code` | `varchar(100)` | No | `—` | — | Código de referencia de la transacción asignado por el procesador de pago. |
| 4 | `provider` | `varchar(60)` | No | `—` | — | Nombre del proveedor o procesador externo asociado al m?todo de pago o a la transacci?n. |
| 5 | `transaction_status` | `enum('Pending','Approved','Rejected','Canceled')` | No | `—` | — | Resultado o estado devuelto para la transacción de pago. |
| 6 | `response_message` | `varchar(500)` | Sí | `NULL` | — | Mensaje de respuesta recibido del procesador de pago. |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_transaction_payment` | `payment_ID` | `tb_payments` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `fk_transaction_payment` | INDEX | `payment_ID` |

### `tb_payments`

Registra los pagos de órdenes, el método usado, el importe y su estado.

- **Motor:** InnoDB
- **Filas reportadas:** 13
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_payments. |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) | Identificador del registro relacionado en tb_buyer_orders (ID). |
| 3 | `payment_method_ID` | `bigint unsigned` | No | `—` | FK → tbd_user_payment_methods(ID) | Identificador del registro relacionado en tbd_user_payment_methods (ID). |
| 4 | `amount` | `decimal(12,2)` | No | `—` | — | Importe del pago registrado. |
| 5 | `payment_status` | `enum('Pending','Approved','Rejected','Refunded')` | No | `'Pending'` | — | Estado del ciclo de pago, como pendiente, aprobado, rechazado o reembolsado. |
| 6 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

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

Almacena datos personales y de contacto complementarios al perfil de usuario.

- **Motor:** InnoDB
- **Filas reportadas:** 10006
- **Clave primaria:** `person_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `person_ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_people. |
| 2 | `user_ID` | `int` | Sí | `NULL` | UNIQUE, FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 3 | `courtesy_title` | `varchar(20)` | Sí | `NULL` | — | Tratamiento o título de cortesía de la persona. |
| 4 | `given_names` | `varchar(150)` | No | `—` | — | Nombre o nombres de la persona. |
| 5 | `family_names` | `varchar(150)` | Sí | `NULL` | — | Apellidos de la persona. |
| 6 | `birth_date` | `date` | Sí | `NULL` | — | Fecha de nacimiento de la persona. |
| 7 | `gender` | `enum('Hombre','Mujer','Prefiero no decirlo')` | No | `'Prefiero no decirlo'` | — | Género registrado para la persona. |
| 8 | `country_code` | `char(2)` | Sí | `NULL` | — | Código del país asociado a la persona o a su teléfono. |
| 9 | `phone` | `varchar(25)` | Sí | `NULL` | — | Número telefónico de contacto de la persona. |
| 10 | `status` | `bit(1)` | Sí | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 11 | `creation_date` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 12 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

**Claves foráneas**

| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- | --- |
| `fk_people_users` | `user_ID` | `tb_users` | `ID` | — | — |

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `user_ID` | UNIQUE | `user_ID` |

### `tb_product_categorias`

Asocia productos con categorías.

- **Motor:** InnoDB
- **Filas reportadas:** 7000
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_product_categorias. |
| 2 | `product_ID` | `int unsigned` | No | `—` | FK → tb_products(ID) | Identificador del registro relacionado en tb_products (ID). |
| 3 | `category_ID` | `int unsigned` | No | `—` | FK → tbc_categorias(ID) | Identificador del registro relacionado en tbc_categorias (ID). |
| 4 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 6 | `last_update` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

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

Guarda las calificaciones y reseñas que los usuarios publican sobre productos.

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_product_reviews. |
| 2 | `product_ID` | `int unsigned` | No | `—` | FK → tb_products(ID) | Identificador del registro relacionado en tb_products (ID). |
| 3 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 4 | `rating` | `tinyint unsigned` | No | `—` | — | Calificación numérica asignada al producto. |
| 5 | `review` | `text` | Sí | `—` | — | Texto de la reseña del producto. |
| 6 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

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

Contiene el catálogo de productos, precios, existencias y estado de publicación.

- **Motor:** InnoDB
- **Filas reportadas:** 7000
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_products. |
| 2 | `SKU` | `varchar(50)` | No | `—` | UNIQUE | Código de referencia del producto en el catálogo o inventario. |
| 3 | `name` | `varchar(250)` | No | `—` | — | Nombre visible del elemento del catálogo. |
| 4 | `description` | `text` | Sí | `—` | — | Descripción textual del elemento del catálogo. |
| 5 | `current_price` | `decimal(10,2)` | No | `'0.00'` | — | Precio vigente del producto. |
| 6 | `current_stock` | `int unsigned` | No | `'0'` | — | Cantidad disponible actualmente en inventario. |
| 7 | `status` | `tinyint(1)` | No | `'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 8 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 9 | `last_update` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `SKU` | UNIQUE | `SKU` |

### `tb_returns`

Registra solicitudes de devolución de órdenes y su estado.

- **Motor:** InnoDB
- **Filas reportadas:** 1
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_returns. |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) | Identificador del registro relacionado en tb_buyer_orders (ID). |
| 3 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 4 | `reason` | `varchar(500)` | No | `—` | — | Motivo indicado para solicitar la devolución. |
| 5 | `return_status` | `enum('Requested','Approved','Rejected','Completed')` | No | `'Requested'` | — | Estado del proceso de devolución. |
| 6 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 8 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

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

Contiene información de envío, seguimiento y entrega de las órdenes.

- **Motor:** InnoDB
- **Filas reportadas:** 6
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_shipments. |
| 2 | `buyer_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) | Identificador del registro relacionado en tb_buyer_orders (ID). |
| 3 | `address_ID` | `bigint unsigned` | No | `—` | FK → tb_user_addresses(ID) | Identificador del registro relacionado en tb_user_addresses (ID). |
| 4 | `tracking_number` | `varchar(120)` | Sí | `NULL` | — | Número de guía o referencia para rastrear el envío. |
| 5 | `carrier` | `varchar(100)` | Sí | `NULL` | — | Empresa transportista encargada del envío. |
| 6 | `shipment_status` | `enum('Pending','Preparing','Shipped','Delivered','Lost','Returned')` | No | `'Pending'` | — | Estado actual del envío. |
| 7 | `shipped_date` | `datetime` | Sí | `NULL` | — | Fecha en que el paquete fue enviado. |
| 8 | `delivered_date` | `datetime` | Sí | `NULL` | — | Fecha en que el paquete fue entregado. |
| 9 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 10 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 11 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

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

Almacena las direcciones de entrega de cada usuario.

- **Motor:** InnoDB
- **Filas reportadas:** 8
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_user_addresses. |
| 2 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 3 | `address_label` | `varchar(100)` | No | `—` | — | Etiqueta que permite identificar la dirección, por ejemplo casa o trabajo. |
| 4 | `recipient_name` | `varchar(150)` | Sí | `NULL` | — | Nombre de la persona que recibirá el envío en esta dirección. |
| 5 | `recipient_phone` | `varchar(25)` | Sí | `NULL` | — | Teléfono de contacto de la persona que recibirá el envío. |
| 6 | `delivery_instructions` | `varchar(500)` | Sí | `NULL` | — | Indicaciones adicionales para realizar la entrega. |
| 7 | `latitude` | `decimal(10,7)` | Sí | `NULL` | — | Coordenada de latitud de la ubicación de la dirección. |
| 8 | `longitude` | `decimal(10,7)` | Sí | `NULL` | — | Coordenada de longitud de la ubicación de la dirección. |
| 9 | `is_default` | `bit(1)` | No | `b'1'` | — | Indica si este registro está marcado como preferido o predeterminado. |
| 10 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 11 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 12 | `last_update` | `datetime` | Sí | `NULL` | — | Fecha y hora de la última modificación del registro. |

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

Contiene las cuentas de acceso de los usuarios.

- **Motor:** InnoDB
- **Filas reportadas:** 10016
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tb_users. |
| 2 | `email` | `varchar(100)` | No | `—` | UNIQUE | Dirección de correo electrónico de acceso o contacto de la cuenta. |
| 3 | `nick` | `varchar(50)` | No | `—` | UNIQUE | Nombre de usuario o alias público de la cuenta. |
| 4 | `password` | `varchar(100)` | No | `—` | — | Contraseña o valor de credencial almacenado para la autenticación. |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 6 | `last_update` | `datetime` | Sí | `NULL` | — | Fecha y hora de la última modificación del registro. |
| 7 | `last_login` | `datetime` | Sí | `NULL` | — | Fecha y hora del último inicio de sesión registrado. |
| 8 | `status` | `tinyint(1)` | No | `'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `email` | UNIQUE | `email` |
| `nick` | UNIQUE | `nick` |

### `tbc_categorias`

Catálogo jerárquico de categorías para clasificar productos.

- **Motor:** InnoDB
- **Filas reportadas:** 100
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tbc_categorias. |
| 2 | `name` | `varchar(120)` | No | `—` | UNIQUE | Nombre visible del elemento del catálogo. |
| 3 | `description` | `text` | Sí | `—` | — | Descripción textual del elemento del catálogo. |
| 4 | `sup_id_category` | `int unsigned` | Sí | `NULL` | FK → tbc_categorias(ID) | Identificador del registro relacionado en tbc_categorias (ID). |
| 5 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 6 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 7 | `last_update` | `datetime` | No | `—` | — | Fecha y hora de la última modificación del registro. |

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

Catálogo de métodos o proveedores de pago disponibles.

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tbc_payment_methods. |
| 2 | `code` | `varchar(30)` | No | `—` | UNIQUE | Código corto que identifica el método de pago en el catálogo. |
| 3 | `description` | `text` | No | `—` | — | Descripción textual del elemento del catálogo. |
| 4 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 6 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_payment_code` | UNIQUE | `code` |

### `tbc_payment_methods_types`

Catálogo de tipos de método de pago que un usuario puede registrar.

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tbc_payment_methods_types. |
| 2 | `name` | `varchar(100)` | No | `—` | UNIQUE | Nombre visible del elemento del catálogo. |
| 3 | `description` | `text` | Sí | `—` | — | Descripción textual del elemento del catálogo. |
| 4 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 6 | `last_update` | `datetime` | Sí | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

**Claves foráneas**

_Sin claves foráneas._

**Índices**

| Nombre | Tipo | Columnas |
| --- | --- | --- |
| `uk_payment_method_type_name` | UNIQUE | `name` |

### `tbd_address_components`

Desglosa una dirección en componentes, como calle, ciudad o código postal, y permite jerarquizarlos.

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT, UNIQUE | Identificador unico que distingue cada registro de tbd_address_components. |
| 2 | `address_ID` | `bigint unsigned` | No | `—` | UNIQUE, FK → tb_user_addresses(ID), FK → tbd_address_components(address_ID, ID) | Identificador del registro relacionado en tb_user_addresses (ID). |
| 3 | `value` | `varchar(255)` | No | `—` | — | Valor textual de este componente de la dirección. |
| 4 | `component_type` | `varchar(50)` | No | `—` | — | Tipo de dato de dirección que representa el componente, como ciudad o calle. |
| 5 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 6 | `address_sup_ID` | `bigint unsigned` | Sí | `NULL` | FK → tbd_address_components(address_ID, ID) | Identificador del registro relacionado en tbd_address_components (address_ID, ID). |
| 7 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 8 | `last_update` | `datetime` | Sí | `NULL` | — | Fecha y hora de la última modificación del registro. |

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

Detalla los artículos y cantidades incluidos en una cancelación.

- **Motor:** InnoDB
- **Filas reportadas:** 2
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tbd_cancellation_items. |
| 2 | `cancellation_ID` | `bigint unsigned` | No | `—` | FK → tb_order_cancellations(ID) | Identificador del registro relacionado en tb_order_cancellations (ID). |
| 3 | `order_item_ID` | `int unsigned` | No | `—` | FK → tbd_order_items(ID) | Identificador del registro relacionado en tbd_order_items (ID). |
| 4 | `quantity` | `int unsigned` | No | `—` | — | Cantidad de unidades del artículo en el carrito, orden, cancelación o devolución. |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |

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

Detalla los productos y proveedores incluidos en cada carrito.

- **Motor:** InnoDB
- **Filas reportadas:** 30
- **Clave primaria:** `cart_ID`, `provider_ID`, `product_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `cart_ID` | `int unsigned` | No | `—` | PK, FK → tb_carts(ID) | Identificador del registro relacionado en tb_carts (ID). |
| 2 | `provider_ID` | `int` | No | `—` | PK, FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 3 | `product_ID` | `int unsigned` | No | `—` | PK, FK → tb_products(ID) | Identificador del registro relacionado en tb_products (ID). |
| 4 | `quantity` | `int unsigned` | No | `'1'` | — | Cantidad de unidades del artículo en el carrito, orden, cancelación o devolución. |
| 5 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |

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

Detalla los productos, cantidades y precios que componen una orden.

- **Motor:** InnoDB
- **Filas reportadas:** 25
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `int unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tbd_order_items. |
| 2 | `seller_order_ID` | `int unsigned` | No | `—` | FK → tb_buyer_orders(ID) | Identificador del registro relacionado en tb_buyer_orders (ID). |
| 3 | `product_ID` | `int unsigned` | No | `—` | FK → tb_products(ID) | Identificador del registro relacionado en tb_products (ID). |
| 4 | `provider_ID` | `int` | No | `—` | FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 5 | `product_name` | `varchar(255)` | No | `—` | — | Nombre del producto conservado como referencia al momento de crear la orden. |
| 6 | `quantity` | `int unsigned` | No | `—` | — | Cantidad de unidades del artículo en el carrito, orden, cancelación o devolución. |
| 7 | `unit_price` | `decimal(12,2)` | No | `—` | — | Precio por unidad del producto registrado en el artículo de la orden. |
| 8 | `subtotal` | `decimal(12,2)` | Sí | `—` | — | Importe de los artículos de la orden antes de agregar el costo de envío. |
| 9 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |

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

Relaciona productos con usuarios proveedores y registra el tipo de propiedad y disponibilidad.

- **Motor:** InnoDB
- **Filas reportadas:** 10
- **Clave primaria:** `user_ID`, `product_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `user_ID` | `int` | No | `—` | PK, FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 2 | `product_ID` | `int unsigned` | No | `—` | PK, FK → tb_products(ID) | Identificador del registro relacionado en tb_products (ID). |
| 3 | `type_ownership` | `enum('Owner','Reseller','Distributor')` | Sí | `NULL` | — | Tipo de relación de propiedad o titularidad entre el usuario y el producto. |
| 4 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 5 | `available_date` | `datetime` | No | `—` | — | Fecha a partir de la cual el producto se encuentra disponible. |
| 6 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 7 | `last_update` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora de la última modificación del registro. |

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

Detalla los artículos y cantidades incluidos en una devolución.

- **Motor:** InnoDB
- **Filas reportadas:** 1
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tbd_return_items. |
| 2 | `return_ID` | `bigint unsigned` | No | `—` | FK → tb_returns(ID) | Identificador del registro relacionado en tb_returns (ID). |
| 3 | `order_item_ID` | `int unsigned` | No | `—` | FK → tbd_order_items(ID) | Identificador del registro relacionado en tbd_order_items (ID). |
| 4 | `quantity` | `int unsigned` | No | `—` | — | Cantidad de unidades del artículo en el carrito, orden, cancelación o devolución. |
| 5 | `observation` | `varchar(500)` | Sí | `NULL` | — | Nota adicional sobre el artículo devuelto. |
| 6 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |

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

Almacena los métodos de pago registrados por cada usuario y sus referencias seguras.

- **Motor:** InnoDB
- **Filas reportadas:** 9
- **Clave primaria:** `ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `ID` | `bigint unsigned` | No | `—` | PK, AUTO_INCREMENT | Identificador unico que distingue cada registro de tbd_user_payment_methods. |
| 2 | `user_ID` | `int` | No | `—` | FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 3 | `payment_method_type_ID` | `int unsigned` | No | `—` | FK → tbc_payment_methods(ID) | Identificador del registro relacionado en tbc_payment_methods (ID). |
| 4 | `provider` | `varchar(60)` | No | `—` | UNIQUE | Nombre del proveedor o procesador externo asociado al m?todo de pago o a la transacci?n. |
| 5 | `provider_method_ref` | `varchar(255)` | No | `—` | UNIQUE | Referencia del método de pago guardada por el proveedor; permite identificarlo sin almacenar todos sus datos sensibles. |
| 6 | `label` | `varchar(100)` | Sí | `NULL` | — | Nombre descriptivo que el usuario asignó al método de pago. |
| 7 | `last_four` | `char(4)` | Sí | `NULL` | — | Últimos cuatro dígitos visibles del medio de pago, usados para reconocerlo. |
| 8 | `is_default` | `tinyint(1)` | No | `'0'` | — | Indica si este registro está marcado como preferido o predeterminado. |
| 9 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 10 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 11 | `last_update` | `datetime` | Sí | `NULL` | — | Fecha y hora de la última modificación del registro. |

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

Relaciona usuarios con productos guardados en su lista de deseos.

- **Motor:** InnoDB
- **Filas reportadas:** 0
- **Clave primaria:** `user_ID`, `product_ID`

| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |
| ---: | --- | --- | :---: | --- | --- | --- |
| 1 | `user_ID` | `int` | No | `—` | PK, FK → tb_users(ID) | Identificador del registro relacionado en tb_users (ID). |
| 2 | `product_ID` | `int unsigned` | No | `—` | PK, FK → tb_products(ID) | Identificador del registro relacionado en tb_products (ID). |
| 3 | `status` | `bit(1)` | No | `b'1'` | — | Estado lógico o de actividad del registro dentro del proceso correspondiente. |
| 4 | `creation_date` | `datetime` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se creó el registro. |
| 5 | `last_update` | `datetime` | No | `—` | — | Fecha y hora de la última modificación del registro. |

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

- `vw_auditoria_casos_prueba`
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

