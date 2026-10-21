{
  "name": "delivery-backend",
  "version": "1.0.0",
  "description": "Backend para seguimiento de delivery en tiempo real - El Búnker Gourmet",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "http": "^0.0.1-security",
    "socket.io": "^4.7.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
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

// Base de datos simulada en memoria
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

// Ruta base para verificar que el servidor esté activo
app.get('/', (req, res) => {
  res.send('Servidor de Delivery corriendo correctamente');
});

// Ruta API para obtener la información del pedido por ID
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

// WebSockets para actualizar y emitir ubicación GPS en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('actualizar_ubicacion_motorizado', (data) => {
    const { pedidoId, latitud, longitud } = data;

    if (pedidos[pedidoId]) {
      pedidos[pedidoId].motorizado.latitude = latitud;
      pedidos[pedidoId].motorizado.longitude = longitud;
    }

    io.emit(tracking_pedido_${pedidoId}, {
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
  console.log(Servidor ejecutándose en el puerto ${PORT});
});