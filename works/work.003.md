### 了解 WebSocket API

### 使用 WebSocket API 实现双人联机贪吃蛇

1. 联机贪吃蛇中，其中一个客户端（浏览器）作为主机，另一个客户端（浏览器）仅做客户端，通过 WebSocket 同步操作和状态
2. 主机端随机生成一个六位的房间号，客户端输入这个房间号后，开始游戏
3. 客户端将自己的操作通过 WebSocket 转发给客户端，客户端接收主机同步的地图、蛇、食物的位置，渲染到自己的页面中
4. 主机要需要接收客户端同步过来的操作，更新对方控制蛇的方向，并将地图、蛇、食物的位置通过 WebSocket 同步给客户端

Socket 地址:
`ws://server.capital-lb.top:8080`

交互数据结构:

```ts
/** 创建房间 */
type CreateRoom = {
  key: "create-room";
  data: { code: string };
};
/** 加入房间 */
type JoinRoom = {
  key: "join-room";
  data: { code: string };
};
/** 游戏开始 */
type GameStart = {
  key: "game-start";
};
/** 方向类型 */
type Direction = "Up" | "Down" | "Right" | "Left";
/** 同步操作 */
type SyncDirection = {
  key: "sync-direction";
  data: { direction: Direction };
};
/** 蛇身坐标组 */
type SnakeBody = [x: number, y: number][];
/** 同步地图 */
type SyncMap = {
  key: "sync-map";
  snakes: SnakeBody[];
  food: [x: number, y: number][];
};
/** 游戏结束 */
type GameOver = {
  key: "game-over";
};
```

Socket 客户端代码示例:

```ts
const snakes = createSnakes(2);

function changeSnakeDirection(snake: Snake, direction: Direction) {
  if (direction === "Up") {
    snake.direction = [0, -1];
  }
  // .....
  // .....
  // .....
}

const socket = new WebSocket("ws://server.capital-lb.top:8080");

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  if (data.key === "sync-operation") {
    changeSnakeDirection(snakes[1], data.data.operation);
  }
});
```
