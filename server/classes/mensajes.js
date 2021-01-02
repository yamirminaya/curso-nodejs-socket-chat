class Mensajes {
  constructor() {
    this.mensajes = []
  }

  agregarMensaje(usuario, mensaje) {
    let mensaje = { usuario, mensaje, fecha: new Date().getTime() }
    this.mensajes.push(mensaje)
    return this.mensajes
  }
}
module.exports = Mensajes
