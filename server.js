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

// Base de datos simulada
const pedidos = {
  "1": {
    orderId: "1",
    status: "En camino",
    restaurante: {
      nombre: "El Búnker Gourmet",
      latitude: 11.0825,
      longitude: -63.9631
    },
    motorizado: {
      nombre: "Carlos Delgado",
      telefono: "+584120000000",
      latitude: 11.0825,
      longitude: -63.9631
    },
    destino: {
      direccion: "Pampatar, Nueva Esparta",
      latitude: 10.9575,
      longitude: -63.8695
    }
  }
};

app.get('/', (req, res) => {
  res.send('Servidor de Delivery corriendo correctamente');
});

app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const pedido = pedidos[orderId];

  if (pedido) {
    res.status(200).json(pedido);
  } else {
    res.status(404).json({
      error: "Pedido no encontrado",
      orderId: orderId
    });
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('actualizar_ubicacion_motorizado', (data) => {
    const { pedidoId, latitud, longitud } = data;

    if (pedidos[pedidoId]) {
      pedidos[pedidoId].motorizado.latitude = latitud;
      pedidos[pedidoId].motorizado.longitude = longitud;
    }

    io.emit('tracking_pedido_' + pedidoId, {
      pedidoId: pedidoId,
      latitud: latitud,
      longitud: longitud,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Servidor ejecutandose en el puerto ' + PORT);
});