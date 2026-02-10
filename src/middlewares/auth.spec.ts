import { beforeEach, describe, expect, it, vi } from "vitest";
import { Response, NextFunction } from "express";
import { ensureAuth, ensureAuthViaQuery, AuthenticatedRequest } from "./auth";
import { HttpError } from "../errors/HttpError";
import { jwt, userService } from "../container";

vi.mock("../container", () => ({
    jwt: {
        verifyTokenAsync: vi.fn()
    },
    userService: {
        findByEmail: vi.fn()
    }
}));

const mockRequest = (overrides = {}): AuthenticatedRequest => ({
    headers: {},
    user: {},
    query: {},
    ...overrides
} as any);

const mockResponse = (): Response => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
} as any);

const mockNext = vi.fn() as NextFunction;

const mockUser = {
    id: 1,
    email: "user@example.com",
    name: "John Doe",
    password: "hashedPassword",
    createdAt: new Date(),
    updatedAt: new Date()
};

const mockDecodedToken = {
    email: "user@example.com",
    iat: Math.floor(Date.now() / 1000)
};

describe("Auth Middleware", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("ensureAuth", () => {
        it("Deve lançar erro quando Authorization header não está presente", async () => {
            const req = mockRequest({ headers: {} });
            const res = mockResponse();

            expect(async () => await  ensureAuth(req, res, mockNext)).toThrow(HttpError);
            expect(async () => await ensureAuth(req, res, mockNext)).toThrow("Não autorizado, nenhum token foi encontrado!");
        });

        it("Deve atribuir usuário ao request.user quando válido" , async () => {
            const req = mockRequest({
                headers: { authorization: "Bearer my_token_here" }
            });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            await ensureAuth(req, res, mockNext);

            expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledWith(
                "my_token_here",
                expect.any(Function)
            );
            expect(req.user).toEqual(mockUser);
        });

        it("Deve verificar token com jwt.verifyToken", () => {
            const req = mockRequest({
                headers: { authorization: "Bearer valid_token" }
            });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            ensureAuth(req, res, mockNext);

            expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledTimes(1);
        });

        it("Deve buscar usuário pelo email do token decodificado", () => {
            const req = mockRequest({
                headers: { authorization: "Bearer valid_token" }
            });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            ensureAuth(req, res, mockNext);

            expect(vi.mocked(userService.findByEmail)).toHaveBeenCalledWith("user@example.com");
        });

        it("Deve chamar next() quando token é válido",async () => {
            const req = mockRequest({
                headers: { authorization: "Bearer valid_token" }
            });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            ensureAuth(req, res, mockNext);

            await new Promise(resolve => setImmediate( resolve));

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe("ensureAuthViaQuery", () => {
        it("Deve lançar erro quando token não está presente na query", () => {
            const req = mockRequest({ query: {} });
            const res = mockResponse();

            expect(() => ensureAuthViaQuery(req, res, mockNext)).toThrow(HttpError);
            expect(() => ensureAuthViaQuery(req, res, mockNext)).toThrow("Token não encontrado!");
        });

        it("Deve lançar erro quando token não é uma string", () => {
            const req = mockRequest({ query: { token: 12345 } });
            const res = mockResponse();

            expect(() => ensureAuthViaQuery(req, res, mockNext)).toThrow(HttpError);
            expect(() => ensureAuthViaQuery(req, res, mockNext)).toThrow("O parâmetro token deve ser do tipo string!");
        });

        it("Deve atribuir usuário ao request.user quando válido", async () => {
            const req = mockRequest({ query: { token: "query_token" } });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            ensureAuthViaQuery(req, res, mockNext);

            await new Promise(resolve => setImmediate( resolve));

            expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledWith(
                "query_token",
                expect.any(Function)
            );

            expect(req.user).toEqual(mockUser)
        });

        it("Deve verificar token com jwt.verifyToken", () => {
            const req = mockRequest({ query: { token: "valid_token" } });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            ensureAuthViaQuery(req, res, mockNext);

            expect(vi.mocked(jwt.verifyToken)).toHaveBeenCalledTimes(1);
        });

        it("Deve buscar usuário pelo email do token decodificado", () => {
            const req = mockRequest({ query: { token: "valid_token" } });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            ensureAuthViaQuery(req, res, mockNext);

            expect(vi.mocked(userService.findByEmail)).toHaveBeenCalledWith("user@example.com");
        });

        it("Deve chamar next() quando token é válido", async () => {
            const req = mockRequest({ query: { token: "valid_token" } });
            const res = mockResponse();

            vi.mocked(jwt.verifyToken).mockImplementation((token, callback) => {
                callback(null, mockDecodedToken);
            });

            vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

            ensureAuthViaQuery(req, res, mockNext);

            await new Promise(resolve => setImmediate( resolve));

            expect(mockNext).toHaveBeenCalled();
        });
    });
});
