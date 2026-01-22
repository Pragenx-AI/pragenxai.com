import { createServer } from "http";
import app from "../server/app";
import { registerRoutes } from "../server/routes";

// Setup routes
const server = createServer(app);
registerRoutes(server, app);

export default app;
