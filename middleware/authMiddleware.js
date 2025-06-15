exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next(); // Utilizador autenticado → continua
  }
  res.redirect('/login'); // Redireciona se não estiver logado
};
