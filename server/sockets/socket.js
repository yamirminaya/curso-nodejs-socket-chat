const { io } = require('../server')
const { crearMensaje } = require('../utilidades/utilidades')

const Usuarios = require('../classes/Usuarios')
const usuarios = new Usuarios()

io.on('connection', (client) => {
  client.on('entrarChat', (data, callback) => {
    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: 'El nombre/sala es necesario',
      })
    }
    //* Conectarse a una sala en particular
    client.join(data.sala)
    usuarios.agregarPersona(client.id, data.nombre, data.sala)
    //* Emitiendo a todo el mundo
    // client.broadcast.emit('listaPersonas', usuarios.getPersonas())

    //* Emitiendo a una sala en particular
    client.broadcast
      .to(data.sala)
      .emit('listaPersonas', usuarios.getPersonasPorSala(data.sala))

    callback(usuarios.getPersonasPorSala(data.sala))
  })

  client.on('crearMensaje', (data) => {
    let persona = usuarios.getPersona(client.id)
    let mensaje = crearMensaje(persona.nombre, data.mensaje)
    //* Emitiendo mensajes solo a personas que se encuentren en la misma sala
    client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
  })

  client.on('disconnect', () => {
    let personaBorrada = usuarios.borrarPersona(client.id)
    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        'crearMensaje',
        crearMensaje('Administrador', `${personaBorrada.nombre} salió`)
      )
    client.broadcast
      .to(personaBorrada.sala)
      .emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))
  })

  //Mensajes privados
  client.on('mensajePrivado', (data) => {
    let persona = usuarios.getPersona(client.id)

    client.broadcast
      .to(data.para)
      .emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
  })
})
