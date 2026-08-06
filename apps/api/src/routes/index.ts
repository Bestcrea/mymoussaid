import type { Express } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import projectRouter from "./project.routes";
import documentRouter from "./document.routes";
import bidRouter from "./bid.routes";
import messageRouter from "./message.routes";
import dashboardRouter from "./dashboard.routes";
import adminRouter from "./admin.routes";

export function setupRoutes(app: Express) {
  const v1 = "/api/v1";
  app.use(`${v1}/auth`,      authRouter);
  app.use(`${v1}/users`,     userRouter);
  app.use(`${v1}/projects`,  projectRouter);
  app.use(`${v1}/dashboard`, dashboardRouter);
  app.use(`${v1}/admin`,     adminRouter);
  app.use(v1,                documentRouter);
  app.use(v1,                bidRouter);
  app.use(v1,                messageRouter);
}
