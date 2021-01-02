var params = new URLSearchParams(window.location.search)
var nombre = params.get('nombre')
var sala = params.get('sala')

// referencias de jQuery
var divUsuarios = $('#divUsuarios')
var formEnviar = $('#formEnviar')
var txtMensaje = $('#txtMensaje')
var divChatbox = $('#divChatbox')

//* Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
  var html = ''
  html += '<li>'
  html +=
    '<a href="javascript:void(0)" class="active">Chat de <span> ' +
    params.get('sala') +
    '</span></a>'
  html += '</li>'

  for (var i = 0; i < personas.length; i++) {
    if (personas[i].nombre !== nombre) {
      html += '<li>'
      html +=
        '<a data-id="' +
        personas[i].id +
        '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"/>'
      html +=
        '<span>' +
        personas[i].nombre +
        '<small class="text-success">online</small></span>'
      html += '</a>'
      html += '</li>'
    }
  }
  divUsuarios.html(html)
}

function renderizarMensajes(data, yo) {
  console.log(data)
  var tipo = tipo || ''

  var html = ''
  var fecha = new Date(data.fecha)
  var hora = fecha.getHours() + ':' + fecha.getMinutes()

  if (yo) {
    console.log('yo')
  } else {
    console.log('otra persona')
  }

  if (data.persona === 'Administrador') {
    if (typeof data.mensaje !== 'undefined') {
      html += `<li class='userLeftOrEntered' style='text-align: center;'>
        <span style='margin:auto;width:auto;padding:2px 7px;font-style: italic;background-color:#F8D7DA;border-radius:4px;'>
          ${data.mensaje}
        </span>
      </li>`
    }
  } else {
    if (data.persona.id === usuario.id) {
      html += `<li class="reverse">
              <div class="chat-content">
                <h5>${data.persona.nombre}</h5>
                <div class="box bg-light-inverse">
                  ${data.mensaje}
                </div>
              </div>
              <div class="chat-img">
                <img src="assets/images/users/5.jpg" alt="user" />
              </div>
              <div class="chat-time">${hora}</div>
            </li>`
    } else {
      html += `<li>
              <div class="chat-img">
                <img src="assets/images/users/2.jpg" alt="user" />
              </div>
              <div class="chat-content">
                <h5>${data.persona.nombre}</h5>
                <div class="box bg-light-info">
                  ${data.mensaje}
                </div>
              </div>
              <div class="chat-time">${hora}</div>
            </li>`
    }
  }

  divChatbox.append(html)
}

// function renderizarMensajes(data) {
//   console.log(data)
//   var tipo = tipo || ''

//   var html = ''
//   var fecha = new Date(data.fecha)
//   var hora = fecha.getHours() + ':' + fecha.getMinutes()

//   if (data.persona === 'Administrador') {
//     if (typeof data.mensaje !== 'undefined') {
//       html += `<li class='userLeftOrEntered' style='text-align: center;'>
//         <span style='margin:auto;border:1px solid rgba(0, 255, 238, 0.279);width:auto;padding:2px 7px;font-style: italic;background-color:aliceblue;border-radius:4px;'>
//           ${data.mensaje}
//         </span>
//       </li>`
//     }
//   } else {
//     if (data.persona.id === usuario.id) {
//       html += `<li class="reverse">
//               <div class="chat-content">
//                 <h5>${data.persona.nombre}</h5>
//                 <div class="box bg-light-inverse">
//                   ${data.mensaje}
//                 </div>
//               </div>
//               <div class="chat-img">
//                 <img src="assets/images/users/5.jpg" alt="user" />
//               </div>
//               <div class="chat-time">${hora}</div>
//             </li>`
//     } else {
//       html += `<li>
//               <div class="chat-img">
//                 <img src="assets/images/users/2.jpg" alt="user" />
//               </div>
//               <div class="chat-content">
//                 <h5>${data.persona.nombre}</h5>
//                 <div class="box bg-light-info">
//                   ${data.mensaje}
//                 </div>
//               </div>
//               <div class="chat-time">${hora}</div>
//             </li>`
//     }
//   }

//   divChatbox.append(html)
// }

// Listeners
divUsuarios.on('click', 'a', function () {
  var id = $(this).data('id')
  if (id) {
    console.log(id)
  }
})

formEnviar.on('submit', function (e) {
  e.preventDefault()
  if (txtMensaje.val().trim().length === 0) {
    return
  }

  socket.emit(
    'crearMensaje',
    {
      nombre: nombre,
      mensaje: txtMensaje.val(),
    },
    function (mensaje) {
      renderizarMensajes(mensaje, true)
      txtMensaje.val('').focus()
      scrollBottom()
    }
  )
})

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children('li:last-child')

  // heights
  var clientHeight = divChatbox.prop('clientHeight')
  var scrollTop = divChatbox.prop('scrollTop')
  var scrollHeight = divChatbox.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight()
  var lastMessageHeight = newMessage.prev().innerHeight() || 0

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight)
  }
}
