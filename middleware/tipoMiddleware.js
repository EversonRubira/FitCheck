exports.isPro = (req, res, next) => {
  if (req.session.userTipo === 'pro') {
    return next();
  }
  return res.status(403).render('erro403', {
    mensagem: 'Apenas utilizadores PRO podem atualizar o perfil.'
  });
};
