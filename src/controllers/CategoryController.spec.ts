import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryService } from "../services/CategoryService";
import { CategoryController } from "./CategoryControllers";
import { HttpError } from "../errors/HttpError";


const categoryServiceMock = {
    findAllCategory: vi.fn(),
    findByIdCategory: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),

} as unknown as CategoryService;

const findAllCategoryMock = vi.mocked(categoryServiceMock.findAllCategory);
const findByIdCategoryMock = vi.mocked(categoryServiceMock.findByIdCategory);
const createCategoryMock = vi.mocked(categoryServiceMock.createCategory);
const updateCategoryMock = vi.mocked(categoryServiceMock.updateCategory);
const deleteCategoryMock = vi.mocked(categoryServiceMock.deleteCategory);

const categoryFake = {
            id: 1,
            name: "Categoria 1",
            position: 1
        };

describe("Category Controller ", () => {
    const categoryControllerMock = new CategoryController(categoryServiceMock);
    beforeEach(() => {
        vi.clearAllMocks()
    });

    it("Deve buscar todas as categorias", async () => {

        const req: any = {};
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        findAllCategoryMock.mockResolvedValueOnce([categoryFake]);

        await categoryControllerMock.index(req, res , next);

        expect(res.json).toHaveBeenCalledWith([categoryFake]);
        expect(findAllCategoryMock).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve lançar um erro se não houver categorias", async () => {
        const req: any = {};
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        findAllCategoryMock.mockRejectedValueOnce(new HttpError(404, "Nenhuma categoria encontrada"));
        await categoryControllerMock.index(req, res , next);
        expect(findAllCategoryMock).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(expect.any(HttpError));
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("Deve buscar uma categoria pelo ID", async () => {
        const req: any = {
            params: {
                id: 1
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        findByIdCategoryMock.mockResolvedValueOnce(categoryFake);

        await categoryControllerMock.show(req, res , next);

        expect(res.json).toHaveBeenCalledWith(categoryFake);
        expect(findByIdCategoryMock).toHaveBeenCalledWith(1);
        expect(findByIdCategoryMock).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve criar uma categoria nova ", async () => {
        const req: any = {
            body: {
                name: "Categoria 1",
                position: 1
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        createCategoryMock.mockResolvedValueOnce(categoryFake);
        await categoryControllerMock.create(req, res , next);

        expect(res.json).toHaveBeenCalledWith(categoryFake);
        expect(createCategoryMock).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve Atualizar uma categoria", async () => {
          const req: any = {
            params: {
                id: 1
            },
            body: {
                name: "nova categoria"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        updateCategoryMock.mockResolvedValueOnce({ ...categoryFake, name: "nova categoria"});
        await categoryControllerMock.update(req, res , next);
        expect(res.json).toHaveBeenCalledWith({...categoryFake, name: "nova categoria"});
        expect(updateCategoryMock).toHaveBeenCalledWith(1, {name: "nova categoria"});
        expect(updateCategoryMock).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve deletar uma categoria pelo ID", async () => {
        const req: any = {
            params: {
                id: 1
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        deleteCategoryMock.mockResolvedValueOnce(categoryFake);
        await categoryControllerMock.delete(req, res, next);
        expect(res.json).toHaveBeenCalledWith(categoryFake);
        expect(deleteCategoryMock).toHaveBeenCalledWith(1);
        expect(deleteCategoryMock).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

});