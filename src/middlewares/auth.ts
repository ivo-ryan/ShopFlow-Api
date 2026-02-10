import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";
import { jwt, userService } from "../container";

export interface AuthenticatedRequest extends Request {
    user?: User|null
}

export const ensureAuth = async (req: AuthenticatedRequest, res: Response , next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) throw new HttpError(404, "Não autorizado, nenhum token foi encontrado!");

    const token = authHeader.replace(/Bearer /, '');

    const decoded = await jwt.verifyTokenAsync(token);
    const user = await userService.findByEmail(decoded.email);
    req.user = user;
    next();
}

export const ensureAuthViaQuery = async (req: AuthenticatedRequest , res: Response , next: NextFunction) => {
    const { token } = req.query;

    if(!token) throw new HttpError(404, 'Token não encontrado!');

    if(typeof token !== 'string') throw new HttpError(400, 'O parâmetro token deve ser do tipo string!');

    const decoded = await jwt.verifyTokenAsync(token);
    const user = await userService.findByEmail(decoded.email);
    req.user = user;
    next();
} 