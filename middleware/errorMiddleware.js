exports.handler = (err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).send('Algo correu mal no servidor.');
};
