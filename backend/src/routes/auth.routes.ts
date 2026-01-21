import { Router, Request, Response, NextFunction } from "express";
import { authController } from "../controllers/auth.controller";
import { AuthenticatedRequest } from "../types";

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  authController.register(req as AuthenticatedRequest, res).catch(next)
);

router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  authController.login(req as AuthenticatedRequest, res).catch(next)
);

router.post("/refresh", (req: Request, res: Response, next: NextFunction) =>
  authController.refresh(req as AuthenticatedRequest, res).catch(next)
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) =>
  authController.logout(req as AuthenticatedRequest, res).catch(next)
);

export default router;
