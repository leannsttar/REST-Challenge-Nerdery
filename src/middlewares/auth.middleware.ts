import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types/auth-request";

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  const isRevoked = await AuthService.isTokenRevoked(token);
  if (isRevoked) {
    return res.status(401).json({ message: "Session expired (logged out)" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
