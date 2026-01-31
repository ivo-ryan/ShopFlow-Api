import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ICartProductRepositorie } from '../repositories/CartProductRepositorie';
import { CartProductService } from './CartService';

const cartProductRespositoryMock: ICartProductRepositorie = {
    addProductInCart: vi.fn(),
    cleanCart: vi.fn(),
    getProductsInCart: vi.fn(),
    productExists: vi.fn(),
    removeProductInCart: vi.fn(),
    updateQuantityInCart: vi.fn(),
};

const productFake = {
    id: 1,
    name: "Produto Teste",
    description: "Descrição do produto teste",
    price: 100,
    mark: "Marca Teste",
    categoryId: 1,
    oldPrice: 120
};

describe('CartProductService', () => {
    const cartProductService = new CartProductService(cartProductRespositoryMock);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve verificar se o produto existe", async () => {
        (cartProductRespositoryMock.productExists as  any).mockResolvedValueOnce(productFake);
        await cartProductService.productExists(1);
        expect(cartProductRespositoryMock.productExists).toHaveBeenCalledWith(1);
        expect(cartProductRespositoryMock.productExists).toHaveBeenCalledTimes(1);
    });

    it("Deve adicionar um produto ao carrinho", async () => {
        (cartProductRespositoryMock.productExists as  any).mockResolvedValueOnce(productFake);
        (cartProductRespositoryMock.updateQuantityInCart as any).mockResolvedValueOnce(null);
        (cartProductRespositoryMock.addProductInCart as any).mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, quantity: 1 });
        const result = await cartProductService.addProductCart(1, 1);
        expect(cartProductRespositoryMock.productExists).toHaveBeenCalledWith(1);
        expect(cartProductRespositoryMock.productExists).toHaveBeenCalledTimes(1);
        expect(cartProductRespositoryMock.updateQuantityInCart).toHaveBeenCalledWith(1, 1, 0);
        expect(cartProductRespositoryMock.addProductInCart).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual({ id: 1, userId: 1, productId: 1, quantity: 1 });
        expect(cartProductRespositoryMock.addProductInCart).toHaveBeenCalledTimes(1);
    });

    it("Deve remover um produto do carrinho", async () => {
        (cartProductRespositoryMock.productExists as  any).mockResolvedValueOnce(productFake);
        (cartProductRespositoryMock.removeProductInCart as any).mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, quantity: 0 });
        const result = await cartProductService.removeProductInCart(1, 1);
        expect(cartProductRespositoryMock.productExists).toHaveBeenCalledWith(1);
        expect(cartProductRespositoryMock.productExists).toHaveBeenCalledTimes(1);
        expect(cartProductRespositoryMock.removeProductInCart).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual({ id: 1, userId: 1, productId: 1, quantity: 0 });
        expect(cartProductRespositoryMock.removeProductInCart).toHaveBeenCalledTimes(1);
    });

    it("Deve obter todos os produtos do carrinho", async () => {
        (cartProductRespositoryMock.getProductsInCart as  any).mockResolvedValueOnce([{ id: 1, userId: 1, productId: 1, quantity: 2 }]);
        const result = await cartProductService.getAllProducts(1);
        expect(cartProductRespositoryMock.getProductsInCart).toHaveBeenCalledWith(1);
        expect(cartProductRespositoryMock.getProductsInCart).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ id: 1, userId: 1, productId: 1, quantity: 2 }]);
    });

    it("Deve limpar o carrinho", async () => {
        (cartProductRespositoryMock.cleanCart as  any).mockResolvedValueOnce();
        await cartProductService.cleanCart(1);
        expect(cartProductRespositoryMock.cleanCart).toHaveBeenCalledWith(1);
        expect(cartProductRespositoryMock.cleanCart).toHaveBeenCalledTimes(1);
    });

});