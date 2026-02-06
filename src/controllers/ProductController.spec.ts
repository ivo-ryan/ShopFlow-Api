import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductService } from "../services/ProductService";
import { ProductController } from "./ProductControllers";
import { Decimal } from "@prisma/client/runtime/library";
import { HttpError } from "../errors/HttpError";

const productServiceMock = {
    addFavorite: vi.fn(),
    findAllProducts: vi.fn(),
    findByIdProduct: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    featuredProducts: vi.fn(),
    findUniqueFavorites: vi.fn(),
    favorites: vi.fn(),
    deleteFavorite: vi.fn()
} as unknown as ProductService;

const addFavorite = vi.mocked(productServiceMock.addFavorite);
const findAllProducts = vi.mocked(productServiceMock.findAllProducts);
const findByIdProduct = vi.mocked(productServiceMock.findByIdProduct);
const createProduct = vi.mocked(productServiceMock.createProduct);
const updateProduct = vi.mocked(productServiceMock.updateProduct);
const deleteProduct = vi.mocked(productServiceMock.deleteProduct);
const featuredProducts = vi.mocked(productServiceMock.featuredProducts);
const findUniqueFavorites = vi.mocked(productServiceMock.findUniqueFavorites);
const favorites = vi.mocked(productServiceMock.favorites);
const deleteFavorite = vi.mocked(productServiceMock.deleteFavorite);

const productFake = {
    name: "Produto 1",
    id: 1,
    description: "Description exemplo",
    price: Decimal(100),
    mark: "genêrico",
    categoryId: 1,
    isNew: true,
    oldPrice: Decimal(200),
    rating: 3,
    featured: true
};

const favoriteProductFake = {
    userId: 1,
    productId: 1,
    createdAt: new Date(),
    updatedAt:new Date()
};

describe(" Product Controller ", () => {
    const productControllerMock = new ProductController(productServiceMock);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve buscar todos os produtos", async () => {
        const req: any = {
            query: {
                name: "" ,
                order: "asc", 
                page:"1", 
                pageSize: "10", 
                sortBy: "name"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        findAllProducts.mockResolvedValueOnce({
            data: [productFake],
            meta: {
                page: 1,
                pageSize: 1,
                total: 1,
                totalPages: 1
            }
        });

        await productControllerMock.index(req, res, next);

        expect(findAllProducts).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            data: [productFake],
            meta: {
                page: 1,
                pageSize: 1,
                total: 1,
                totalPages: 1
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve lançar um erro e chamar o next", async () => {
        const req: any = {
            query: {}
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        const error = new HttpError(400, "Erro ao buscar produtos!");

        findAllProducts.mockRejectedValueOnce(error);

        await productControllerMock.index(req, res, next);

        expect(res.json).not.toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
        expect(next).toHaveBeenCalledTimes(1);
    })

    it("Deve buscar um produto pelo ID", async () => {
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

        findByIdProduct.mockResolvedValueOnce(productFake);

        await productControllerMock.show(req, res, next);

        expect(findByIdProduct).toHaveBeenCalledWith(1);
        expect(findByIdProduct).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(productFake);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve criar um produto", async () => {
        const req: any = {
            body: {
                name: "Produto 1",
                description: "Description exemplo",
                price: 100,
                mark: "genêrico",
                categoryId: 1,
                isNew: true,
                oldPrice: 200,
                rating: 3,
                featured: true
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        createProduct.mockResolvedValueOnce(productFake);

        await productControllerMock.create(req, res, next);

        expect(createProduct).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(productFake);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve atualizar um produto", async () => {
        const req: any = {
            params: {
                id: 1
            },
            body: {
                name: "Produto atualizado"
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        updateProduct.mockResolvedValueOnce({
            ...productFake,
            name: "Produto atualizado"
        });

        await productControllerMock.update(req, res, next);

        expect(updateProduct).toHaveBeenCalledWith(1, { name: "Produto atualizado" });
        expect(updateProduct).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            ...productFake,
            name: "Produto atualizado"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve deletar um produto pelo ID", async () => {
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

        deleteProduct.mockResolvedValueOnce(productFake);

        await productControllerMock.delete(req, res, next);

        expect(deleteProduct).toHaveBeenCalledWith(1);
        expect(deleteProduct).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(productFake);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve buscar produtos em destaque", async () => {
        const req: any = {};
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        featuredProducts.mockResolvedValueOnce([productFake]);

        await productControllerMock.featuredProduct(req, res, next);

        expect(featuredProducts).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([productFake]);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve adicionar um produto aos favoritos", async () => {
        const req: any = {
            user: {
                id: 1
            },
            body: {
                productId: 1
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        addFavorite.mockResolvedValueOnce( favoriteProductFake);

        await productControllerMock.addFavorite(req, res, next);

        expect(addFavorite).toHaveBeenCalledWith(1, 1);
        expect(addFavorite).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
                                    userId: 1,
                                    productId: 1,
                                    createdAt: expect.any(Date),
                                    updatedAt: expect.any(Date)
                                });
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve buscar um produto favorito específico", async () => {
        const req: any = {
            user: {
                id: 1
            },
            params: {
                productId: 1
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        findUniqueFavorites.mockResolvedValueOnce(favoriteProductFake);

        await productControllerMock.getFavoriteProduct(req, res, next);

        expect(findUniqueFavorites).toHaveBeenCalledWith(1, 1);
        expect(findUniqueFavorites).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
                                    userId: 1,
                                    productId: 1,
                                    createdAt: expect.any(Date),
                                    updatedAt: expect.any(Date)
                                });
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve buscar todos os produtos favoritos do usuário", async () => {
        const req: any = {
            user: {
                id: 1
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        favorites.mockResolvedValueOnce([favoriteProductFake]);

        await productControllerMock.getAllFavorites(req, res, next);

        expect(favorites).toHaveBeenCalledWith(1);
        expect(favorites).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([{
                                    userId: 1,
                                    productId: 1,
                                    createdAt: expect.any(Date),
                                    updatedAt: expect.any(Date)
                                }]);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve remover um produto dos favoritos", async () => {
        const req: any = {
            user: {
                id: 1
            },
            params: {
                productId: 1
            }
        };
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        deleteFavorite.mockResolvedValueOnce(favoriteProductFake);

        await productControllerMock.deleteFavorite(req, res, next);

        expect(deleteFavorite).toHaveBeenCalledWith(1, 1);
        expect(deleteFavorite).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
                                    userId: 1,
                                    productId: 1,
                                    createdAt: expect.any(Date),
                                    updatedAt: expect.any(Date)
                                });
        expect(next).not.toHaveBeenCalled();
    });
});
