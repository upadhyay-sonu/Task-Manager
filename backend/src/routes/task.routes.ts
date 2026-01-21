import { Router, Request, Response, NextFunction } from "express";
import { taskController } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../types";

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

router.post("/", (req: Request, res: Response, next: NextFunction) =>
  taskController.createTask(req as AuthenticatedRequest, res).catch(next)
);

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  taskController.listTasks(req as AuthenticatedRequest, res).catch(next)
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  taskController.getTask(req as AuthenticatedRequest, res).catch(next)
);

router.patch("/:id", (req: Request, res: Response, next: NextFunction) =>
  taskController.updateTask(req as AuthenticatedRequest, res).catch(next)
);

router.patch("/:id/toggle", (req: Request, res: Response, next: NextFunction) =>
  taskController.toggleTask(req as AuthenticatedRequest, res).catch(next)
);

router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
  taskController.deleteTask(req as AuthenticatedRequest, res).catch(next)
);

export default router;
