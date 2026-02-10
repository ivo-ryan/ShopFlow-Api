import { beforeEach, describe, expect, it, vi } from "vitest";
import { CartProductPrismaRepositorie } from "./CartProductPrismaRepositorie";
import { prisma } from "../../database/database";

vi.mock("../../database/database", () => ({
    prisma: {
        user: {
            findUniqueOrThrow: vi.fn(),
            findUnique: vi.fn(),
        },
        cart: {
            create: vi.fn(),
        },
        cartProduct: {
            create: vi.fn(),
            delete: vi.fn(),
            deleteMany: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        product: {
            findUnique: vi.fn(),
        }
    }
}));


describe("CartProduct Prisma Repository", () => {
    const repository = new CartProductPrismaRepositorie();

    const mockUser = {
        id: 10,
        name: "Test User",
        email: "test@test.com",
        password: "hashed_password"
    };

    const mockCart = { id: 1, userId: 10 };

    const mockCartProduct = {
        cartId: 1,
        productId: 5,
        quantity: 1,
        addAt: new Date()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve retornar o cartId quando o usuário já possui carrinho", async () => {
        (prisma.user.findUniqueOrThrow as any).mockResolvedValueOnce({
            ...mockUser,
            cart: mockCart
        });

        const cartId = await repository.cartIdExists(10);

        expect(prisma.user.findUniqueOrThrow).toHaveBeenCalled();
        expect(cartId).toBe(1);
    });

    it("Deve criar um carrinho quando o usuário não possui", async () => {
        (prisma.user.findUniqueOrThrow as any).mockResolvedValueOnce({
            ...mockUser,
            cart: null
        });

        (prisma.cart.create as any).mockResolvedValueOnce({ id: 2, userId: 10 });

        const cartId = await repository.cartIdExists(10);

        expect(prisma.cart.create).toHaveBeenCalledWith({ data: { userId: 10 } });
        expect(cartId).toBe(2);
    });

    it("Deve adicionar um produto no carrinho", async () => {
        vi.spyOn(repository, "cartIdExists").mockResolvedValueOnce(1);

        await repository.addProductInCart(10, 5);

        expect(prisma.cartProduct.create).toHaveBeenCalledWith({
            data: { cartId: 1, productId: 5 }
        });
    });

    it("Deve remover um produto do carrinho", async () => {
        vi.spyOn(repository, "cartIdExists").mockResolvedValueOnce(1);

        await repository.removeProductInCart(10, 5);

        expect(prisma.cartProduct.delete).toHaveBeenCalledWith({
            where: { cartId_productId: { cartId: 1, productId: 5 } }
        });
    });

    it("Deve buscar produtos do carrinho com imagens", async () => {
        vi.spyOn(repository, "cartIdExists").mockResolvedValueOnce(1 as any);

        await repository.getProductsInCart(10);

        expect(prisma.cartProduct.findMany).toHaveBeenCalledWith({
            where: { cartId: 1 },
            include: {
                product: {
                    include: { images: true }
                }
            }
        });
    });

    it("Deve verificar se um produto existe", async () => {
        await repository.productExists(5);

        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: 5 }
        });
    });

    it("Deve retornar null se o produto não estiver no carrinho", async () => {
        vi.spyOn(repository, "cartIdAlreadyExists").mockResolvedValueOnce({
            ...mockUser,
            cart: null
        } as any);

        const result = await repository.productAlreadyInCart(10, 5);

        expect(result).toBeNull();
    });

    it("Deve buscar produto se ele já estiver no carrinho", async () => {
        vi.spyOn(repository, "cartIdAlreadyExists").mockResolvedValueOnce({
            ...mockUser,
            cart: mockCart
        } as any);

        await repository.productAlreadyInCart(10, 5);

        expect(prisma.cartProduct.findUnique).toHaveBeenCalledWith({
            where: { cartId_productId: { cartId: 1, productId: 5 } }
        });
    });

    it("Deve remover produto quando a quantidade ficar menor ou igual a zero", async () => {
        vi.spyOn(repository, "productAlreadyInCart").mockResolvedValueOnce({
            ...mockCartProduct,
            quantity: 1
        } as any);
        vi.spyOn(repository, "cartIdAlreadyExists").mockResolvedValueOnce({
            ...mockUser,
            cart: mockCart
        } as any);

        const result = await repository.updateQuantityInCart(10, 5, -1);

        expect(prisma.cartProduct.delete).toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it("Deve atualizar a quantidade do produto no carrinho", async () => {
        vi.spyOn(repository, "productAlreadyInCart").mockResolvedValueOnce({
            ...mockCartProduct,
            quantity: 2
        } as any);
        vi.spyOn(repository, "cartIdAlreadyExists").mockResolvedValueOnce({
            ...mockUser,
            cart: mockCart
        } as any);

        await repository.updateQuantityInCart(10, 5, 1);

        expect(prisma.cartProduct.update).toHaveBeenCalledWith({
            where: { cartId_productId: { cartId: 1, productId: 5 } },
            data: { quantity: 3 }
        });
    });

    it("Deve limpar o carrinho quando existir", async () => {
        vi.spyOn(repository, "cartIdAlreadyExists").mockResolvedValueOnce({
            ...mockUser,
            cart: mockCart
        } as any);

        await repository.cleanCart(10);

        expect(prisma.cartProduct.deleteMany).toHaveBeenCalledWith({
            where: { cartId: 1 }
        });
    });

    it("Não deve limpar carrinho quando não existir", async () => {
        vi.spyOn(repository, "cartIdAlreadyExists").mockResolvedValueOnce({
            ...mockUser,
            cart: null
        } as any);

        await repository.cleanCart(10);

        expect(prisma.cartProduct.deleteMany).not.toHaveBeenCalled();
    });
});
