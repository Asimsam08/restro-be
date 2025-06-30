// import { Server } from "socket.io";

// let ioInstance: Server;

// export const initSocket = (io: Server) => {
//   ioInstance = io;

//   io.on("connection", (socket) => {
//     console.log("New client connected:", socket.id);

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });
// };

// export const emitOrderUpdate = (order: any) => {
//   if (ioInstance) {
//     ioInstance.emit("order-status-updated", order); 
//   }
// };


import { Server } from "socket.io";

let ioInstance: Server;

export const initSocket = (io: Server) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join room based on role or type
    socket.on("joinRoom", (roomName) => {
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room: ${roomName}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

// When a customer places a new order
export const emitNewOrderToRestaurants = (order: any) => {
  if (ioInstance) {
    ioInstance.to("restaurant-room").emit("newOrderPlaced", order);
  }
};

// When restaurant updates an order's status
export const emitOrderStatusUpdate = (order: any) => {
  if (ioInstance) {
    console.log(`Emitting to: customer-${order.user_id}`);

    ioInstance.to("customer-" + order.user_id).emit("orderStatusUpdated", order); 
    ioInstance.to("restaurant-room").emit("orderStatusUpdated", order); 
  }
};
