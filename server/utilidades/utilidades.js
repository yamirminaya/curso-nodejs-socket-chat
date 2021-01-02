const crearMensaje = (persona, mensaje) => {
  return {
    persona,
    mensaje,
    fecha: new Date().getTime(),
  }
}
module.exports = {
  crearMensaje,
}
