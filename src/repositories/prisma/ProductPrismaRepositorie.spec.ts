import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../database/database";
import { ProductPrismaRepositorie } from "./ProductPrismaRepositorie";
import { AddImageAttributes, CreateProductAttributes, FindProductParams, ProductWhereParams } from "../ProductRepositorie";

vi.mock("../../database/database", () => ({
    prisma: {
        product: {
            findMany: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn()
        },

        productImage: {
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        },

        favorite: {
            findMany: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        }
    }
}));

const params:FindProductParams = {};
const productCountParams:ProductWhereParams = {};
const productFake: CreateProductAttributes = {
    categoryId: 1,
    description: "Description exemplo",
    featured: true,
    isNew: true,
    mark: "Genêrico",
    name: "Creatina",
    oldPrice: 200,
    price: 100,
    rating: 4
};

describe("Product prisma repositorie", () => {
    const repository = new ProductPrismaRepositorie();
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve chamar findMany corretamente", async () => {
        await repository.findMany(params);
        expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o count corretamente", async () => {
        await repository.count(productCountParams);
        expect(prisma.product.count).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o findUnique corretamente", async () => {
        await repository.findUnique(1);
        expect(prisma.product.findUnique).toHaveBeenCalledWith({
             where: { id: 1 } ,
             include: {
                images: true
             }
        });
        expect(prisma.product.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o create corretamente", async () => {
        await repository.create(productFake);
        expect(prisma.product.create).toHaveBeenCalledWith({
            data: productFake
        });
        expect(prisma.product.create).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o update corretamente ", async () => {
        await repository.update(1, productFake);
        expect(prisma.product.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: productFake
        });
        expect(prisma.product.update).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o delete corretamente", async () => {
        await repository.delete(1);
        expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(prisma.product.delete).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar featuredProduct corretamente", async () => {
        await repository.featuredProduct();
        expect(prisma.product.findMany).toHaveBeenCalledWith({
            where: { featured: true },
            include: { images: true }
        });
        expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar addImage corretamente", async () => {
        const img: AddImageAttributes = { productId: 1, url: "http://img" };
        await repository.addImage(img);
        expect(prisma.productImage.create).toHaveBeenCalledWith({ data: img });
        expect(prisma.productImage.create).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar updateImage corretamente", async () => {
        await repository.updateImage(1, { url: "new" });
        expect(prisma.productImage.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { url: "new" }
        });
        expect(prisma.productImage.update).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar removeImage corretamente", async () => {
        await repository.removeImage(1);
        expect(prisma.productImage.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(prisma.productImage.delete).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar imageExists corretamente", async () => {
        await repository.imageExists(1);
        expect(prisma.productImage.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(prisma.productImage.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar addFavoriteProduct corretamente", async () => {
        await repository.addFavoriteProduct(2, 3);
        expect(prisma.favorite.create).toHaveBeenCalledWith({ data: { productId: 3, userId: 2 } });
        expect(prisma.favorite.create).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar getProductFavoriteById corretamente", async () => {
        await repository.getProductFavoriteById(2, 3);
        expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
            where: { userId_productId: { productId: 3, userId: 2 } }
        });
        expect(prisma.favorite.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar removeFavoriteProduct corretamente", async () => {
        await repository.removeFavoriteProduct(2, 3);
        expect(prisma.favorite.delete).toHaveBeenCalledWith({
            where: { userId_productId: { productId: 3, userId: 2 } }
        });
        expect(prisma.favorite.delete).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar getAllFavorites corretamente", async () => {
        await repository.getAllFavorites(2);
        expect(prisma.favorite.findMany).toHaveBeenCalledWith({
            where: { userId: 2 },
            include: { product: { include: { images: true } } }
        });
        expect(prisma.favorite.findMany).toHaveBeenCalledTimes(1);
    });

});