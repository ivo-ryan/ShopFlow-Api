import { beforeEach, describe, expect, it, vi } from "vitest";
import { IUserRepositorie } from "../repositories/UserRepositorie";
import { UserService } from "./UserService";
import bcrypt from  "bcrypt"

vi.mock("bcrypt", () => {
    return {
        default: {
            hash: vi.fn().mockResolvedValue("hashed_password"),
            compare: vi.fn().mockResolvedValue(true),
        }
    }
});

const userRepositorieMock: IUserRepositorie = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

const jwtServiceMock = {
    secret: "test_secret",
    signToken: vi.fn(),
    verifyToken: vi.fn(),
    verifyTokenAsync: vi.fn()
}

const findManyMock = vi.mocked(userRepositorieMock.findMany);
const findUniqueMock = vi.mocked(userRepositorieMock.findUnique);
const findByIdMock = vi.mocked(userRepositorieMock.findById);
const createMock = vi.mocked(userRepositorieMock.create);
const updateMock = vi.mocked(userRepositorieMock.update);
const deleteMock = vi.mocked(userRepositorieMock.delete);

const userFake = {
    name: "Usuário de Teste",
    email: "usuario@teste.com",
    password: "senha123"
}

describe("UserService", () => {
    const userService = new UserService(userRepositorieMock, jwtServiceMock);
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve criar um novo usuário", async () => {
        findUniqueMock.mockResolvedValueOnce(null);
        createMock.mockResolvedValueOnce({ id: 1, ...userFake , password: "hashed_password"});
        const result = await userService.createUser(userFake);
        expect(findUniqueMock).toHaveBeenCalledWith(userFake.email);
        expect(createMock).toHaveBeenCalled();
        expect(result).toEqual({ id: 1, ...userFake, password: "hashed_password" });
    });

    it("Deve lançar um erro ao tentar criar um usuário com email já existente", async () => {
        findUniqueMock.mockResolvedValueOnce({ id: 1, ...userFake });
        await expect(userService.createUser(userFake)).rejects.toThrow("Usuário já existente com esse mesmo email!");
        expect(findUniqueMock).toHaveBeenCalledWith(userFake.email);
        expect(createMock).not.toHaveBeenCalled();
    });

    it("Deve atualizar um usuário pelo ID", async () => {
        findByIdMock.mockResolvedValueOnce({ id: 1, ...userFake });
        updateMock.mockResolvedValueOnce({ id: 1, ...userFake, name: "Usuário Atualizado" });
        const result = await userService.updateById(1, { name: "Usuário Atualizado" });
        expect(findByIdMock).toHaveBeenCalledWith(1);
        expect(updateMock).toHaveBeenCalledWith(1, { name: "Usuário Atualizado" });
        expect(result).toEqual({ id: 1, ...userFake, name: "Usuário Atualizado" });
    });

    it("Deve lançar um erro ao tentar atualizar um usuário inexistente", async () => {
        findByIdMock.mockResolvedValueOnce(null);
        await expect(userService.updateById(1, { name: "Usuário Atualizado" })).rejects.toThrow("Usuário não encontrado!");
        expect(findByIdMock).toHaveBeenCalledWith(1);
        expect(updateMock).not.toHaveBeenCalled();
    });

    it("Deve lançar um erro ao tentar deletar um usuário inexistente", async () => {
        findByIdMock.mockResolvedValueOnce(null);
        await expect(userService.deleteById(1)).rejects.toThrow("Usuário não encontrado!");
        expect(findByIdMock).toHaveBeenCalledWith(1);
        expect(deleteMock).not.toHaveBeenCalled();
    });

    it("Deve deletar um usuário pelo ID", async () => {
        findByIdMock.mockResolvedValueOnce({ id: 1, ...userFake });
        deleteMock.mockResolvedValueOnce({ id: 1, ...userFake });
        const result = await userService.deleteById(1);
        expect(findByIdMock).toHaveBeenCalledWith(1);
        expect(deleteMock).toHaveBeenCalledWith(1);
        expect(result).toEqual({ id: 1, ...userFake });
    });

    it("Deve buscar todos os usuários", async () => {
        findManyMock.mockResolvedValueOnce([{ id: 1, ...userFake }]);
        const result = await userService.findAll();
        expect(findManyMock).toHaveBeenCalled();
        expect(result).toEqual([{ id: 1, ...userFake }]);
    });

    it("Deve buscar um usuário pelo email", async () => {
        findUniqueMock.mockResolvedValueOnce({ id: 1, ...userFake });
        const result = await userService.findByEmail(userFake.email);
        expect(findUniqueMock).toHaveBeenCalledWith(userFake.email);
        expect(result).toEqual({ id: 1, ...userFake });
    });

    it("Deve checar a senha do usuário e retornar um token", async () => {
        findUniqueMock.mockResolvedValueOnce({ id: 1, ...userFake });
        jwtServiceMock.signToken.mockReturnValueOnce("valid_token");
        const result = await userService.checkPassword(userFake.email, userFake.password);
        expect(findUniqueMock).toHaveBeenCalledWith(userFake.email);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(jwtServiceMock.signToken).toHaveBeenCalledWith(1, userFake.email);
        expect(result).toBe("valid_token");
    });
});