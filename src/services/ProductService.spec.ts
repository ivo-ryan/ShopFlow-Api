import { beforeEach, describe, expect, it, vi } from "vitest";
import { IProductRepositorie } from "../repositories/ProductRepositorie";
import { ProductService } from "./ProductService";
import { Decimal } from "@prisma/client/runtime/library";

const productRepositorieMock: IProductRepositorie = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    addImage: vi.fn(),
    updateImage: vi.fn(),
    removeImage: vi.fn(),
    imageExists: vi.fn(),
    featuredProduct: vi.fn(),
    addFavoriteProduct: vi.fn(),
    removeFavoriteProduct: vi.fn(),
    getAllFavorites: vi.fn(),
    getProductFavoriteById: vi.fn()
}

const findManyMock = vi.mocked(productRepositorieMock.findMany);
const findUniqueMock = vi.mocked(productRepositorieMock.findUnique);
const createMock = vi.mocked(productRepositorieMock.create);
const updateMock = vi.mocked(productRepositorieMock.update);
const deleteMock = vi.mocked(productRepositorieMock.delete);
const countMock = vi.mocked(productRepositorieMock.count);
const addImageMock = vi.mocked(productRepositorieMock.addImage);
const updateImageMock = vi.mocked(productRepositorieMock.updateImage);
const removeImageMock = vi.mocked(productRepositorieMock.removeImage);
const imageExistsMock = vi.mocked(productRepositorieMock.imageExists);
const featuredProductMock = vi.mocked(productRepositorieMock.featuredProduct);
const addFavoriteProductMock = vi.mocked(productRepositorieMock.addFavoriteProduct);
const removeFavoriteProductMock = vi.mocked(productRepositorieMock.removeFavoriteProduct);
const getAllFavoritesMock = vi.mocked(productRepositorieMock.getAllFavorites);
const getProductFavoriteByIdMock = vi.mocked(productRepositorieMock.getProductFavoriteById);

const productFake = {
    id: 1,
    name: "Produto Teste",
    description: "Descrição do produto teste",
    price: new Decimal(100),
    featured: false,
    categoryId: 1,
    isNew: true,
    mark: "Marca Teste",
    oldPrice: new Decimal(120),
    rating: 4.5
};

const createProductFake = {
    name: "Produto Teste",
    description: "Descrição do produto teste",
    price: 100,
    featured: false,
    categoryId: 1,
    isNew: true,
    mark: "Marca Teste",
    oldPrice: 100,
    rating: 4.5
}

const imageFake = {
    url: "http://imagem.teste",
    productId: 1,
    altText: "Imagem de teste"
}

describe('ProductService', () => {
    const productService = new ProductService(productRepositorieMock);
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve buscar todos os produtos corretamente", async () => {
        findManyMock.mockResolvedValueOnce([productFake]);
        countMock.mockResolvedValueOnce(1);
        const result = await productService.findAllProducts({  });
        expect(productRepositorieMock.findMany).toHaveBeenCalledWith({ limit: 10, offset: 0, order: undefined, sortBy: undefined, where: {} });
        expect(result).toEqual({
            data: [productFake],
            meta: {
                page: 1,
                pageSize: 10,
                total: 1,
                totalPages: 1
            }
        });
        expect(productRepositorieMock.findMany).toHaveBeenCalledTimes(1);
    });

    it("Deve filtrar produtos pelo nome", async () => {
        findManyMock.mockResolvedValueOnce([productFake]);
        countMock.mockResolvedValueOnce(1);
        const result = await productService.findAllProducts({ name: "Teste" });
        expect(productRepositorieMock.findMany).toHaveBeenCalledWith({ limit: 10, offset: 0, order: undefined, sortBy: undefined, where: { name: { like: "Teste", mode: "insensitive" } } });
        expect(result).toEqual({
            data: [productFake],
            meta: {
                page: 1,
                pageSize: 10,
                total: 1,
                totalPages: 1
            }
        });
    });

    it("Deve lançar erro se o produto não existir", async () => {
        findUniqueMock.mockResolvedValueOnce(null);
        await expect( productService.productExists(999) ).rejects.toThrow("Produto não encontrado!");
        expect(productRepositorieMock.findUnique).toHaveBeenCalledWith(999);
        expect(productRepositorieMock.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve verificar se o produto existe", async () => {
        findUniqueMock.mockResolvedValueOnce(productFake);
        await productService.productExists(1);
        expect(productRepositorieMock.findUnique).toHaveBeenCalledWith(1);
        expect(productRepositorieMock.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve criar um novo produto", async () => {
        createMock.mockResolvedValueOnce(productFake);
        const result = await productService.createProduct(createProductFake);

        expect(productRepositorieMock.create).toHaveBeenCalledWith(createProductFake);
        expect(result).toEqual(productFake);
        expect(productRepositorieMock.create).toHaveBeenCalledTimes(1);
    });

    it("Deve buscar um produto pelo ID", async () => {
        findUniqueMock
        .mockResolvedValueOnce(productFake)
        .mockResolvedValueOnce(productFake);
        const result = await productService.findByIdProduct(1);
        expect(productRepositorieMock.findUnique).toHaveBeenCalledWith(1);
        expect(result).toEqual(productFake);
        expect(productRepositorieMock.findUnique).toHaveBeenCalledTimes(2); 
    });

    it("Deve atualizar um produto", async () => {
        findUniqueMock.mockResolvedValueOnce(productFake);
        updateMock.mockResolvedValueOnce({ ...productFake, name: "Produto Atualizado" });
        const result = await productService.updateProduct(1, { name: "Produto Atualizado" });
        expect(productRepositorieMock.findUnique).toHaveBeenCalledWith(1);
        expect(productRepositorieMock.update).toHaveBeenCalledWith(1, { name: "Produto Atualizado" });
        expect(result).toEqual({...productFake, name: "Produto Atualizado" });
        expect(productRepositorieMock.findUnique).toHaveBeenCalledTimes(1);
        expect(productRepositorieMock.update).toHaveBeenCalledTimes(1);
    });

    it("Deve obter produtos em destaque", async () => {
        featuredProductMock.mockResolvedValueOnce([productFake]);
        const result = await productService.featuredProducts();
        expect(productRepositorieMock.featuredProduct).toHaveBeenCalledTimes(1);
        expect(result).toEqual([productFake]);
    });

    it("Deve deletar um produto", async () => {
        findUniqueMock.mockResolvedValueOnce(productFake);
        deleteMock.mockResolvedValueOnce(productFake);
        const result = await productService.deleteProduct(1);
        expect(productRepositorieMock.findUnique).toHaveBeenCalledWith(1);
        expect(productRepositorieMock.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual(productFake);
        expect(productRepositorieMock.findUnique).toHaveBeenCalledTimes(1);
        expect(productRepositorieMock.delete).toHaveBeenCalledTimes(1);
    });

    it("Deve lançar erro se a imagem não existir", async () => {
        imageExistsMock.mockResolvedValueOnce(null);
        await expect( productService.imageExists(999) ).rejects.toThrow("Imagem não encontrada!");
        expect(productRepositorieMock.imageExists).toHaveBeenCalledWith(999);
        expect(productRepositorieMock.imageExists).toHaveBeenCalledTimes(1);
    }); 

    it("Deve verificar se a imagem existe", async () => {
        imageExistsMock.mockResolvedValueOnce({ id: 1, ...imageFake});
        await productService.imageExists(1);
        expect(productRepositorieMock.imageExists).toHaveBeenCalledWith(1);
        expect(productRepositorieMock.imageExists).toHaveBeenCalledTimes(1);
    });

    it("Deve adicionar uma imagem ao produto", async () => {
        addImageMock.mockResolvedValueOnce({ id: 1, ...imageFake });
        const result = await productService.addImage(imageFake);
        expect(productRepositorieMock.addImage).toHaveBeenCalledWith(imageFake);
        expect(result).toEqual({ id: 1, ...imageFake });
        expect(productRepositorieMock.addImage).toHaveBeenCalledTimes(1);
    });

    it("Deve atualizar uma imagem do produto", async () => {
        imageExistsMock.mockResolvedValueOnce({ id: 1, ...imageFake });
        updateImageMock.mockResolvedValueOnce({ id: 1, ...imageFake, altText: "Imagem Atualizada" });
        const result = await productService.updateImage(1, { altText: "Imagem Atualizada" });
        expect(productRepositorieMock.updateImage).toHaveBeenCalledWith(1, { altText: "Imagem Atualizada" });
        expect(result).toEqual({ id: 1, ...imageFake, altText: "Imagem Atualizada" });
        expect(productRepositorieMock.updateImage).toHaveBeenCalledTimes(1);
    });

    it("Deve remover uma imagem do produto", async () => {
        imageExistsMock.mockResolvedValueOnce({ id: 1, ...imageFake });
        removeImageMock.mockResolvedValueOnce({ id: 1, ...imageFake });
        const result = await productService.deleteImage(1);
        expect(productRepositorieMock.removeImage).toHaveBeenCalledWith(1);
        expect(result).toEqual({ id: 1, ...imageFake });
        expect(productRepositorieMock.removeImage).toHaveBeenCalledTimes(1);
    });

    it("Deve adicionar um produto aos favoritos", async () => {
        findUniqueMock.mockResolvedValueOnce(productFake);
        addFavoriteProductMock.mockResolvedValueOnce({ createdAt: new Date(), userId: 1, productId: 1, updatedAt: new Date()});
        const result = await productService.addFavorite(1, 1);
        expect(productRepositorieMock.addFavoriteProduct).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual({ userId: 1, productId: 1 , createdAt: expect.any(Date), updatedAt: expect.any(Date)});
        expect(productRepositorieMock.addFavoriteProduct).toHaveBeenCalledTimes(1);

    });

    it("Deve buscar um favorito pelo ID do produto e do usuário", async () => {
        findUniqueMock.mockResolvedValueOnce(productFake);
        getProductFavoriteByIdMock.mockResolvedValueOnce({ userId: 1, productId: 1 , createdAt: new Date(), updatedAt: new Date()});
        const result = await productService.findUniqueFavorites(1, 1);
        expect(productRepositorieMock.getProductFavoriteById).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual({ userId: 1, productId: 1 , createdAt: expect.any(Date), updatedAt: expect.any(Date)});
        expect(productRepositorieMock.getProductFavoriteById).toHaveBeenCalledTimes(1);
    });

    it("Deve remover um produto dos favoritos", async () => {
        findUniqueMock.mockResolvedValueOnce(productFake);
        removeFavoriteProductMock.mockResolvedValueOnce({ userId: 1, productId: 1, createdAt: new Date(), updatedAt: new Date() });
        const result = await productService.deleteFavorite(1, 1);
        expect(productRepositorieMock.removeFavoriteProduct).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual({ userId: 1, productId: 1 , createdAt: expect.any(Date), updatedAt: expect.any(Date)});
        expect(productRepositorieMock.removeFavoriteProduct).toHaveBeenCalledTimes(1);
    });

    it("Deve obter todos os produtos favoritos de um usuário", async () => {
        getAllFavoritesMock.mockResolvedValueOnce([{ userId: 1, productId: 1 , createdAt: new Date(), updatedAt: new Date()}]);
        const result = await productService.favorites(1);
        expect(productRepositorieMock.getAllFavorites).toHaveBeenCalledWith(1);
        expect(result).toEqual([{ userId: 1, productId: 1 , createdAt: expect.any(Date), updatedAt: expect.any(Date)}]);
        expect(productRepositorieMock.getAllFavorites).toHaveBeenCalledTimes(1);
    });

});