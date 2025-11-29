const pool = require('../config/db');

//mostra activos
exports.listar = async (req, res) => {
  const sql = `
    SELECT p.idProducto, p.nombre, p.precio, i.cantidad AS stock
    FROM productos p
    JOIN inventario i ON p.idProducto = i.idProducto
    WHERE i.estatus = 1 AND i.cantidad > 0
    ORDER BY p.nombre;
  `;
  const [rows] = await pool.query(sql);
  res.render('salidas', { productos: rows, usuario: req.session.usuario });
};

//salida
exports.sacar = async (req, res) => {
  const { idProducto, cantidad } = req.body;
  const idUsuario = req.session.usuario.idUsuario;
  const qty = parseInt(cantidad, 10);

  //hay suficiente?
  const [[inv]] = await pool.query(
    'SELECT cantidad FROM inventario WHERE idProducto = ? AND estatus = 1',
    [idProducto]
  );
  if (!inv || inv.cantidad < qty) {
    req.flash('error', 'Stock insuficiente');
    return res.redirect('/salidas');
  }

  //insert salida
  await pool.query(
    'INSERT INTO movimientos (idProducto, tipo, cantidad, idUsuario) VALUES (?, "SALIDA", ?, ?)',
    [idProducto, qty, idUsuario]
  );

  //restar
  await pool.query(
    'UPDATE inventario SET cantidad = cantidad - ? WHERE idProducto = ?',
    [qty, idProducto]
  );

  res.redirect('/salidas');
};