
exports.requireAuth = (req, res, next) => {
  if (!req.session.usuario) return res.redirect('/login');
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (!req.session.usuario || req.session.usuario.idRol !== 1) return res.status(403).render('403');
  next();
};

exports.requireAlmacenista = (req, res, next) => {
  if (!req.session.usuario || req.session.usuario.idRol !== 2) return res.status(403).render('403');
  next();
};