import { WebSocket } from "ws";

type Room = { id: string; sockets: WebSocket[] };

export class RoomManager {
  private rooms: Room[] = [];

  public getRoomById(id: string) {
    return this.rooms.find((item) => item.id === id);
  }

  public getRoomBySocket(socket: WebSocket) {
    return this.rooms.find((item) => item.sockets.includes(socket));
  }

  public joinRoom(id: string, socket: WebSocket) {
    this.getRoomById(id)?.sockets.push(socket);
  }

  public createRoom(id: string, socket: WebSocket) {
    this.rooms.push({ id, sockets: [socket] });
  }
}
