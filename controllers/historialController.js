const pool = require('../config/db');

exports.listar = async (req, res) => {
  const { tipo } = req.query;
  let filtro = '';
  if (tipo) filtro = `WHERE m.tipo = '${tipo}'`;

  const sql = `
    SELECT m.fechaHora,
           u.nombre AS usuario,
           p.nombre AS producto,
           m.tipo,
           m.cantidad
    FROM movimientos m
    JOIN usuarios u ON m.idUsuario = u.idUsuario
    JOIN productos p ON m.idProducto = p.idProducto
    ${filtro}
    ORDER BY m.fechaHora DESC;
  `;
  const [rows] = await pool.query(sql);
  res.render('historial', { movimientos: rows, usuario: req.session.usuario, tipo });
};