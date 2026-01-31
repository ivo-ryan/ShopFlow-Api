import { beforeEach, describe, expect, it, vi } from "vitest";
import { ICheckoutRepositorie, ItemsProps } from "../repositories/CheckoutRepositorie";
import { ICartProductRepositorie } from "../repositories/CartProductRepositorie";
import { CheckoutService } from "./CheckoutService";

const checkoutRepositorieMock: ICheckoutRepositorie = {
    getOrders: vi.fn(),
    createOrder: vi.fn(),
    createPayment: vi.fn(),
    updatePayment: vi.fn(),
    updateOrder: vi.fn(),
}

const cartProductRespositorieMock: ICartProductRepositorie = {
    addProductInCart: vi.fn(),
    cleanCart: vi.fn(),
    getProductsInCart: vi.fn(),
    productExists: vi.fn(),
    removeProductInCart: vi.fn(),
    updateQuantityInCart: vi.fn()
}

const orderFake = {
    id: 1,
    total: 100,
    status: "PENDING",
    userId: 1
};

const itemsFake: ItemsProps[] = [
    { productId: 1, price: 50, quantity: 1 , image: "url1", name: "Product 1"},
    { productId: 2, price: 25, quantity: 2, image: "url2", name: "Product 2"}
    
];
describe('CheckoutService', () => {
    const checkoutService = new CheckoutService(checkoutRepositorieMock, cartProductRespositorieMock);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve obter todos os pedidos do usuário", async () => {
        (checkoutRepositorieMock.getOrders as any).mockResolvedValueOnce([orderFake]);
        const result = await checkoutService.getAllOrders(1);
        expect(checkoutRepositorieMock.getOrders).toHaveBeenCalledWith(1);
        expect(checkoutRepositorieMock.getOrders).toHaveBeenCalledTimes(1);
        expect(result).toEqual([orderFake]);
    });

    it("Deve atualizar o status do pagamento", async () => {
        (checkoutRepositorieMock.updatePayment as any).mockResolvedValueOnce({ id: 1, orderId: 1, amount: 100, status: "PAID" });
        (checkoutRepositorieMock.updateOrder as any).mockResolvedValueOnce(orderFake);
        const result = await checkoutService.updatedPayment(1, "PAID");
        expect(checkoutRepositorieMock.updatePayment).toHaveBeenCalledWith(1, "PAID");
        expect(checkoutRepositorieMock.updatePayment).toHaveBeenCalledTimes(1);
        expect(checkoutRepositorieMock.updateOrder).toHaveBeenCalledWith(1, "PAID");
        expect(checkoutRepositorieMock.updateOrder).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ id: 1, orderId: 1, amount: 100, status: "PAID" });
    });

    it("Deve criar um checkout", async () => {
        (checkoutRepositorieMock.createOrder as any).mockResolvedValueOnce(orderFake);
        (checkoutRepositorieMock.createPayment as any).mockResolvedValueOnce({ id: 1, orderId: 1, amount: 100, status: "PENDING" });
        (cartProductRespositorieMock.cleanCart as any).mockResolvedValueOnce();
        const result = await checkoutService.createCheckout(itemsFake, 1, "Customer Teste");
        expect(checkoutRepositorieMock.createOrder).toHaveBeenCalledWith(100, itemsFake, 1, "Customer Teste");
        expect(checkoutRepositorieMock.createOrder).toHaveBeenCalledTimes(1);
        expect(checkoutRepositorieMock.createPayment).toHaveBeenCalledWith(1, 100);
        expect(checkoutRepositorieMock.createPayment).toHaveBeenCalledTimes(1);
        expect(cartProductRespositorieMock.cleanCart).toHaveBeenCalledWith(1);
        expect(cartProductRespositorieMock.cleanCart).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ id: 1, orderId: 1, amount: 100, status: "PENDING" });
    });
});