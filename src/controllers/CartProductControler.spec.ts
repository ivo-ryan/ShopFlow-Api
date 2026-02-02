import { beforeEach, describe, expect, it, vi } from "vitest";
import { CartProductService } from "../services/CartService";
import { CartProductController } from "./CartProductControllers";
import { HttpError } from "../errors/HttpError";

const cartProductServiceMock = {
    addProductCart: vi.fn(),
    getAllProducts: vi.fn(),
    removeProductInCart: vi.fn(),
} as unknown as CartProductService

const addProductCartMock = vi.mocked(cartProductServiceMock.addProductCart);
const removeProductInCartMock = vi.mocked(cartProductServiceMock.removeProductInCart);
const getAllProductsCartMock = vi.mocked(cartProductServiceMock.getAllProducts);


describe("CartProductController" , () => {
    const cartProductControllerMock = new CartProductController(cartProductServiceMock);

    beforeEach(() => {
        vi.clearAllMocks()
    });

    it("Deve buscar todos os produtos adicionados ao carrinho", async () => {
        const req: any = { 
            user: {
                id:1
            }
        }
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const next = vi.fn();

        getAllProductsCartMock.mockResolvedValueOnce([{
            cartId: 1,
            productId: 1,
            quantity: 1,
            addAt: new Date()
        }]);

        await cartProductControllerMock.getAllProducts(req, res , next);

        expect(res.json).toHaveBeenCalledWith([{
            cartId: 1,
            productId: 1,
            quantity: 1,
            addAt: expect.any(Date)
        }]);
        expect(getAllProductsCartMock).toHaveBeenCalledTimes(1)
        expect(next).not.toHaveBeenCalled()
    });

    it("Deve lançar um erro se não encontrar os produtos ", async () => {
         const req: any = { 
            user: {
                id:1
            }
        }
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const next = vi.fn();

        getAllProductsCartMock.mockRejectedValue(new HttpError(404, "Produtos não encontrados"));

        await cartProductControllerMock.getAllProducts(req, res , next);

        expect(getAllProductsCartMock).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(expect.any(HttpError))
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("Deve adicionar um produto ao carrinho", async () => {
         const req: any = {
            user: {
                id:1
            },

            body: {
               productId: 1,
               change: 1 
            }
        }
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const next = vi.fn();

        addProductCartMock.mockResolvedValueOnce({
            cartId: 1,
            productId: 1,
            quantity: 1,
            addAt: new Date()
        });

        await cartProductControllerMock.addProduct(req , res, next );

        expect(res.json).toHaveBeenCalledWith({
            cartId: 1,
            productId: 1,
            quantity: 1,
            addAt: expect.any(Date)
        });
        expect(addProductCartMock).toHaveBeenCalledWith(1, 1, 1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(next).not.toHaveBeenCalled();
        expect(addProductCartMock).toHaveBeenCalledTimes(1)
    });

    it("Deve remover um produto do carrinho ", async () => {
        const req: any = {
            user: {
                id:1
            },

            params: {
               id: 1
            }
        }
        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const next = vi.fn();

        removeProductInCartMock.mockResolvedValueOnce({
            cartId: 1,
            productId: 1,
            quantity: 1,
            addAt: new Date()
        });

        await cartProductControllerMock.deleteProduct(req, res , next);

        expect(res.json).toHaveBeenCalledWith({
            cartId: 1,
            productId: 1,
            quantity: 1,
            addAt: expect.any(Date)
        });
        expect(removeProductInCartMock).toHaveBeenCalledWith(1, 1);
        expect(next).not.toHaveBeenCalled();
        expect(removeProductInCartMock).toHaveBeenCalledTimes(1)
    });
  
});

