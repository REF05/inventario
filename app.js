require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

//rutas
app.get('/movimientos', (req, res) => res.status(403).render('403'));
app.use('/', require('./routes/auth'));
app.use('/inventario', require('./routes/inventario'));
app.use('/movimientos', require('./routes/movimientos'));
app.use('/salidas', require('./routes/salidas'));
app.use('/historial', require('./routes/historial'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));