import { beforeEach, describe, expect, it, vi } from "vitest";
import { ICategoryRepository } from "../repositories/CategoryRepositorie";
import { CategoryService } from "./CategoryService";


const categoryRepositorieMock: ICategoryRepository = {
    create: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn()
};

const categoryFake = {
    id: 1,
    name: "Categoria Teste",
    position: 1
};

describe('CategoryService', () => {
    const categoryService = new CategoryService(categoryRepositorieMock);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve verificar se a categoria existe", async () => {
        (categoryRepositorieMock.findUnique as any).mockResolvedValueOnce(categoryFake);
        await categoryService.categoryExists(1);
        expect(categoryRepositorieMock.findUnique).toHaveBeenCalledWith(1);
        expect(categoryRepositorieMock.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve criar uma nova categoria", async () => {
        (categoryRepositorieMock.create as any).mockResolvedValueOnce(categoryFake);
        const result = await categoryService.createCategory({ name: "Categoria Teste", position: 1 });
        expect(categoryRepositorieMock.create).toHaveBeenCalledWith({ name: "Categoria Teste", position: 1 });
        expect(result).toEqual(categoryFake);
        expect(categoryRepositorieMock.create).toHaveBeenCalledTimes(1);
    });

    it("Deve buscar todas as categorias", async () => {
        (categoryRepositorieMock.findMany as any).mockResolvedValueOnce([categoryFake]);
        const result = await categoryService.findAllCategory();
        expect(categoryRepositorieMock.findMany).toHaveBeenCalledTimes(1);
        expect(result).toEqual([categoryFake]);
    });

    it("Deve atualizar uma categoria", async () => {
        (categoryRepositorieMock.findUnique as any).mockResolvedValueOnce(categoryFake);
        (categoryRepositorieMock.update as any).mockResolvedValueOnce({ ...categoryFake, name: "Categoria Atualizada" });
        const result = await categoryService.updateCategory(1, { name: "Categoria Atualizada" });
        expect(categoryRepositorieMock.findUnique).toHaveBeenCalledWith(1);
        expect(categoryRepositorieMock.update).toHaveBeenCalledWith(1, { name: "Categoria Atualizada" });
        expect(result).toEqual({ ...categoryFake, name: "Categoria Atualizada" });
        expect(categoryRepositorieMock.findUnique).toHaveBeenCalledTimes(1);
        expect(categoryRepositorieMock.update).toHaveBeenCalledTimes(1);
    });

    it("Deve deletar uma categoria", async () => {
        (categoryRepositorieMock.findUnique as any).mockResolvedValueOnce(categoryFake);
        (categoryRepositorieMock.delete as any).mockResolvedValueOnce(categoryFake);
        const result = await categoryService.deleteCategory(1);
        expect(categoryRepositorieMock.findUnique).toHaveBeenCalledWith(1);
        expect(categoryRepositorieMock.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual(categoryFake);
        expect(categoryRepositorieMock.findUnique).toHaveBeenCalledTimes(1);
        expect(categoryRepositorieMock.delete).toHaveBeenCalledTimes(1);
    });
});