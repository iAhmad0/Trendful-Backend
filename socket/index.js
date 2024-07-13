const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUsers = [];
let admin = {};

io.on("connection", (socket) => {
  socket.on("addNewAdmin", (adminID) => {
    admin = { adminID, socketID: socket.id };

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("addNewUser", (userID) => {
    !onlineUsers.some((user) => user.userID == userID) &&
      onlineUsers.push({ userID, socketID: socket.id });

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("adminSendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userID === message.recepientID
    );

    if (user) {
      io.to(user.socketID).emit("buyerGetMessage", {
        message: message.message,
      });
    }
  });

  socket.on("buyerSendMessage", (message) => {
    if (Object.keys(admin).length) {
      io.to(admin.socketID).emit("adminGetMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3001);
