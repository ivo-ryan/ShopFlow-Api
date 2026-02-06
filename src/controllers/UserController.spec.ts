import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "../services/UserService";
import { UsersController } from "./UsersControllers";
import { HttpError } from "../errors/HttpError";

const userServiceMock = {
    findAll: vi.fn(),
    createUser: vi.fn(),
    checkPassword: vi.fn(),
    findByEmail: vi.fn(),
    updateById: vi.fn(),
    deleteById: vi.fn(),
} as unknown as UserService;

const findAll = vi.mocked(userServiceMock.findAll);
const createUser = vi.mocked(userServiceMock.createUser);
const checkPassword = vi.mocked(userServiceMock.checkPassword);
const findByEmail = vi.mocked(userServiceMock.findByEmail);
const updateById = vi.mocked(userServiceMock.updateById);
const deleteById = vi.mocked(userServiceMock.deleteById);

const userFake = {
    id: 1,
    name: "Ivo",
    email: "ivo@email.com",
    password: "1234"
};

describe(" Users Controller ", () => {
    const usersControllerMock = new UsersController(userServiceMock);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve buscar todos os usuários", async () => {
        const req: any = {};
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        findAll.mockResolvedValueOnce([userFake]);

        await usersControllerMock.index(req, res, next);

        expect(findAll).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([userFake]);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve lançar um erro e chamar o next" , async () => {
        const req: any = {};
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        const error = new HttpError(400, "Erro ao buscar usuários!");

        findAll.mockRejectedValueOnce(error);

        await usersControllerMock.index(req, res, next);

        expect(res.json).not.toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledTimes(1);
    })

    it("Deve criar um novo usuário", async () => {
        const req: any = {
            body: {
                name: "Ivo",
                email: "ivo@email.com",
                password: "123456"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        createUser.mockResolvedValueOnce(userFake);

        await usersControllerMock.create(req, res, next);

        expect(createUser).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(userFake);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve realizar login do usuário", async () => {
        const req: any = {
            body: {
                email: "ivo@email.com",
                password: "123456"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        checkPassword.mockResolvedValueOnce("token-jwt");

        await usersControllerMock.login(req, res, next);

        expect(checkPassword).toHaveBeenCalledWith("ivo@email.com", "123456");
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            authenticated: true,
            token: "token-jwt"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve buscar um usuário pelo email", async () => {
        const req: any = {
            body: {
                email: "ivo@email.com"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        findByEmail.mockResolvedValueOnce(userFake);

        await usersControllerMock.show(req, res, next);

        expect(findByEmail).toHaveBeenCalledWith("ivo@email.com");
        expect(findByEmail).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(userFake);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve atualizar um usuário pelo ID", async () => {
        const req: any = {
            params: {
                id: "1"
            },
            body: {
                name: "Novo Nome"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        updateById.mockResolvedValueOnce({
            ...userFake,
            name: "Novo Nome"
        });

        await usersControllerMock.update(req, res, next);

        expect(updateById).toHaveBeenCalledWith(1, { name: "Novo Nome" });
        expect(updateById).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            ...userFake,
            name: "Novo Nome"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve deletar um usuário pelo ID", async () => {
        const req: any = {
            params: {
                id: "1"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        deleteById.mockResolvedValueOnce(userFake);

        await usersControllerMock.delete(req, res, next);

        expect(deleteById).toHaveBeenCalledWith(1);
        expect(deleteById).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(userFake);
        expect(next).not.toHaveBeenCalled();
    });
});
