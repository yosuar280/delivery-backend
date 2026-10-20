const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de Delivery corriendo correctamente');
});

// Ruta para seguimiento del pedido en FlutterFlow
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;

  res.json({
    orderId: orderId,
    status: "En camino",
    latitude: 11.0825,
    longitude: -63.9631,
    message: "Conexión exitosa con El Búnker Gourmet"
  });
});

// WebSockets para el rastreo GPS en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('actualizar_ubicacion_motorizado', (data) => {
    // Reenvía la posición del motorizado al cliente
    io.emit(tracking_pedido_${data.pedidoId}, {
      latitud: data.latitud,
      longitud: data.longitud,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(Servidor ejecutándose en el puerto ${PORT});
});