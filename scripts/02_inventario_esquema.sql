CREATE DATABASE IF NOT EXISTS inventario_castores;
USE inventario_castores;

CREATE TABLE roles (
    idRol   INT PRIMARY KEY,
    nombre  VARCHAR(30) NOT NULL UNIQUE
);
INSERT INTO roles (idRol, nombre) VALUES
(1, 'Administrador'),
(2, 'Almacenista');


CREATE TABLE usuarios (
    idUsuario   INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    correo      VARCHAR(50)  NOT NULL UNIQUE,
    contrasena  VARCHAR(255) NOT NULL,
    idRol       INT NOT NULL,
    estatus     TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_usuarios_rol
        FOREIGN KEY (idRol) REFERENCES roles(idRol)
);


CREATE TABLE productos (
    idProducto INT PRIMARY KEY,
    nombre     VARCHAR(40) NOT NULL,
    precio     DECIMAL(10,2) NOT NULL
);


CREATE TABLE inventario (
    idInventario INT AUTO_INCREMENT PRIMARY KEY,
    idProducto   INT NOT NULL,
    cantidad     INT NOT NULL DEFAULT 0,
    estatus      TINYINT(1) DEFAULT 1,  -- 1 activo, 0 dado de baja
    CONSTRAINT fk_inv_producto
        FOREIGN KEY (idProducto) REFERENCES productos(idProducto),
    UNIQUE (idProducto)  -- un registro por producto
);

CREATE TABLE movimientos (
    idMovimiento INT AUTO_INCREMENT PRIMARY KEY,
    idProducto   INT NOT NULL,
    tipo         ENUM('ENTRADA','SALIDA') NOT NULL,
    cantidad     INT NOT NULL,
    fechaHora    DATETIME DEFAULT CURRENT_TIMESTAMP,
    idUsuario    INT NOT NULL,
    CONSTRAINT fk_mov_producto
        FOREIGN KEY (idProducto) REFERENCES productos(idProducto),
    CONSTRAINT fk_mov_usuario
        FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);