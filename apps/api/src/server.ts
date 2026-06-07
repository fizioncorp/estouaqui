import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { configureSocketServer } from "./sockets/socketServer.js";

const server = createServer(app);

configureSocketServer(server);

server.listen(env.PORT, () => {
  console.log(`API rodando em http://localhost:${env.PORT}`);
});
