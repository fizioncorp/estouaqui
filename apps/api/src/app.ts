import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { supportRouter } from "./modules/support/support.routes.js";
import { volunteersRouter } from "./modules/volunteers/volunteers.routes.js";
import { conversationsRouter } from "./modules/conversations/conversations.routes.js";
import { reportsRouter } from "./modules/reports/reports.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { legalRouter } from "./modules/legal/legal.routes.js";
import { corsOptions } from "./config/cors.js";
import { apiRateLimit } from "./middlewares/rateLimitMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

export const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(apiRateLimit);

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    project: "Estou Aqui"
  });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/support", supportRouter);
app.use("/volunteers", volunteersRouter);
app.use("/conversations", conversationsRouter);
app.use("/reports", reportsRouter);
app.use("/admin", adminRouter);
app.use("/legal", legalRouter);

app.use(errorMiddleware);
