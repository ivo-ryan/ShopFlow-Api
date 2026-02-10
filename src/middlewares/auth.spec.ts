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

const mockRequest = (overrides = {}): AuthenticatedRequest =>
  ({
    headers: {},
    query: {},
    user: undefined,
    ...overrides
  } as any);

const mockResponse = (): Response =>
  ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
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
    it("lança erro se Authorization header não existir", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await expect(ensureAuth(req, res, mockNext))
        .rejects
        .toThrow(HttpError);

      await expect(ensureAuth(req, res, mockNext))
        .rejects
        .toThrow("Não autorizado, nenhum token foi encontrado!");
    });

    it("atribui usuário ao req.user quando token é válido", async () => {
      const req = mockRequest({
        headers: { authorization: "Bearer valid_token" }
      });
      const res = mockResponse();

      vi.mocked(jwt.verifyTokenAsync).mockResolvedValue(mockDecodedToken);
      vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

      await ensureAuth(req, res, mockNext);

      expect(jwt.verifyTokenAsync).toHaveBeenCalledWith("valid_token");
      expect(userService.findByEmail).toHaveBeenCalledWith("user@example.com");
      expect(req.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("ensureAuthViaQuery", () => {
    it("lança erro se token não existir na query", async () => {
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await expect(ensureAuthViaQuery(req, res, mockNext))
        .rejects
        .toThrow(HttpError);

      await expect(ensureAuthViaQuery(req, res, mockNext))
        .rejects
        .toThrow("Token não encontrado!");
    });

    it("lança erro se token não for string", async () => {
      const req = mockRequest({ query: { token: 123 } });
      const res = mockResponse();

      await expect(ensureAuthViaQuery(req, res, mockNext))
        .rejects
        .toThrow("O parâmetro token deve ser do tipo string!");
    });

    it("atribui usuário ao req.user quando token é válido", async () => {
      const req = mockRequest({ query: { token: "valid_token" } });
      const res = mockResponse();

      vi.mocked(jwt.verifyTokenAsync).mockResolvedValue(mockDecodedToken);
      vi.mocked(userService.findByEmail).mockResolvedValue(mockUser);

      await ensureAuthViaQuery(req, res, mockNext);

      expect(jwt.verifyTokenAsync).toHaveBeenCalledWith("valid_token");
      expect(userService.findByEmail).toHaveBeenCalledWith("user@example.com");
      expect(req.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
