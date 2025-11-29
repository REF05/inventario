const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.loginForm = (req, res) => res.render('login');

exports.autenticar = async (req, res) => {
  const { correo, contrasena } = req.body;
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
  if (rows.length === 0) return res.redirect('/login');

  const usuario = rows[0];
  // contraseña chafa
  if (contrasena !== usuario.contrasena) return res.redirect('/login');

  req.session.usuario = usuario;
  return usuario.idRol === 1
    ? res.redirect('/inventario')
    : res.redirect('/salidas');
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};