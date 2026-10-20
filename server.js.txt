// Ruta para el seguimiento del pedido en FlutterFlow
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;

  res.json({
    orderId: orderId,
    status: "En camino",
    latitude: 11.0825,   // Latitud de prueba
    longitude: -63.9631  // Longitud de prueba
  });
});

// WebSockets para el rastreo GPS en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('actualizar_ubicacion_motorizado', (data) => {
        // Reenvía la posición del motorizado al cliente que sigue el pedido
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
    console.log(Servidor corriendo en el puerto ${PORT});
});