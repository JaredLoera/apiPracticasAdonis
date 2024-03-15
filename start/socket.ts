import Ws from 'App/services/ws'
Ws.boot()

Ws.io.on('connection', (socket) => {
    socket.emit('news', { hello: 'uhsuhzicshihi' })
})