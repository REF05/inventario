const pool = require('../config/db');

//productos + inventario
exports.listar = async (req, res) => {
  const sql = `
    SELECT p.idProducto,
           p.nombre,
           p.precio,
           COALESCE(i.cantidad,0) AS stock,
           i.estatus
    FROM productos p
    LEFT JOIN inventario i ON p.idProducto = i.idProducto
    ORDER BY p.nombre;
  `;
  const [rows] = await pool.query(sql);
  res.render('inventario', { productos: rows, usuario: req.session.usuario });
};

//dar de baja - reactivar
exports.cambiarEstatus = async (req, res) => {
  const { id } = req.params;
  const nuevo = req.body.activo === '1' ? 1 : 0;

  //upsert,si no existe fila, la crea
  await pool.query(
    `INSERT INTO inventario (idProducto, cantidad, estatus)
     VALUES (?, 0, ?)
     ON DUPLICATE KEY UPDATE estatus = ?`,
    [id, nuevo, nuevo]
  );

  res.redirect('/inventario');
};

//registrar entrada de inventario
exports.aumentarInventario = async (req, res) => {
  const { idProducto, cantidad } = req.body;
  const idUsuario = req.session.usuario.idUsuario;
  const cant = parseInt(cantidad, 10);

  await pool.query(
    'INSERT INTO movimientos (idProducto, tipo, cantidad, idUsuario) VALUES (?, "ENTRADA", ?, ?)',
    [idProducto, cant, idUsuario]
  );

  //sumar al inventario 
  await pool.query(
    `INSERT INTO inventario (idProducto, cantidad, estatus)
     VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE cantidad = cantidad + ?`,
    [idProducto, cant, cant]
  );

  res.redirect('/inventario');
};

exports.mostrarFormAgregar = (req, res) => res.render('agregarProducto', { usuario: req.session.usuario });

//prod+inv
exports.agregarProducto = async (req, res) => {
  const { nombre, precio } = req.body;

  const [result] = await pool.query(
    'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
    [nombre, parseFloat(precio)]
  );
  const idProducto = result.insertId;

  await pool.query(
    'INSERT INTO inventario (idProducto, cantidad, estatus) VALUES (?, 0, 1)',
    [idProducto]
  );

  res.redirect('/inventario');
};

//prod id manual
exports.agregarProducto = async (req, res) => {
  const { nombre, precio } = req.body;

  //sig id
  const [rows] = await pool.query('SELECT MAX(idProducto) AS max FROM productos');
  const nuevoId = (rows[0].max || 0) + 1;

  //insertar con id manual
  await pool.query(
    'INSERT INTO productos (idProducto, nombre, precio) VALUES (?, ?, ?)',
    [nuevoId, nombre, parseFloat(precio)]
  );

  //crear inventario stock 0, activo
  await pool.query(
    'INSERT INTO inventario (idProducto, cantidad, estatus) VALUES (?, 0, 1)',
    [nuevoId]
  );

  res.redirect('/inventario');
};

//lectura para almacenista
exports.listarAlma = async (req, res) => {
  const sql = `
    SELECT p.idProducto, p.nombre, p.precio, COALESCE(i.cantidad,0) AS stock, i.estatus
    FROM productos p
    LEFT JOIN inventario i ON p.idProducto = i.idProducto
    ORDER BY p.nombre;
  `;
  const [rows] = await pool.query(sql);
  res.render('inventarioAlma', { productos: rows, usuario: req.session.usuario });
};