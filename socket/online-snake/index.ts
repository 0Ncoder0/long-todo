import { RoomManager } from "./room-manager";
import { WebSocket, WebSocketServer, RawData } from "ws";

const ws = new WebSocketServer({ port: 8080 });
const roomManager = new RoomManager();
console.log(`listening on *:8080`);

const handleMessage = (socket: WebSocket, key: string, data: any) => {
  switch (key) {
    case "create-room": {
      roomManager.createRoom(data.code, socket);
      return;
    }
    case "join-room": {
      roomManager.joinRoom(data.code, socket);
      const room = roomManager.getRoomBySocket(socket);
      room?.sockets?.forEach((item) =>
        item.send(JSON.stringify({ key: "game-start" }))
      );
      return;
    }
    default: {
      const room = roomManager.getRoomBySocket(socket);
      room?.sockets
        .filter((item) => item === socket)
        .forEach((item) => item.send(JSON.stringify({ key, data })));
      return;
    }
  }
};

// 客户端连接时触发
ws.on("connection", (socket) => {
  console.log("a user connected");

  // 客户端断开连接时触发
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // 接收客户端发送的消息，并将消息广播给其他客户端
  socket.on("message", (message) => {
    try {
      const { key, data } = JSON.parse(message.toString());
      handleMessage(socket, key, data);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("received message:", message.toString());
    }
  });
});
