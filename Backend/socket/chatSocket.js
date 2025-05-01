module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ receiverId }) => {
      socket.join(receiverId);
    });

    socket.on("sendMessage", (message) => {
      const room = message.receiver; // This is the userId of the receiver
      io.to(room).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
