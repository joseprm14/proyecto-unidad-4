const app = require('./app');
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app
  .listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  })
  .on("error", (err) => {
    console.error(`Error al iniciar el servidor con error: ${err}`);
  });