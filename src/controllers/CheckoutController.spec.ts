import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutService } from "../services/CheckoutService";
import { CheckoutController } from "./CheckoutControllers";
import { OrderStatus } from "../repositories/CheckoutRepositorie";
import { HttpError } from "../errors/HttpError";

const checkoutServiceMock = {
    getAllOrders: vi.fn(),
    createCheckout: vi.fn(),
    updatedPayment: vi.fn()
} as unknown as CheckoutService;

const getAllOrders = vi.mocked(checkoutServiceMock.getAllOrders);
const createCheckoutMock = vi.mocked(checkoutServiceMock.createCheckout);
const updatedPayment = vi.mocked(checkoutServiceMock.updatedPayment);

const status: OrderStatus = "PENDING" 


const orderPaymentFake = {
    provider: "Order 1",
    status: status ,
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    playgroundUrl: null,
    id: 1,
    orderId: 1,
}

const orderFake = {
    status: status,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 1,
    total: 100,
    customer: null,
    userId: 1
}

const itemsFake = [ 
            {
            productId: 1,
            name: "Creatina",
            price: 100,
            quantity: 1,
            image: "http://exemple.com"
            }
];


describe("CheckoutController ", async () => {
    const checkoutController = new CheckoutController(checkoutServiceMock);
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve criar uma order nova", async () => {
        const req : any = {
            user: {
                name: "Ivo Ryan",
                id: 1
            },

            body: {
                items: itemsFake
            }
        };


        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        createCheckoutMock.mockResolvedValueOnce(orderPaymentFake);

        await checkoutController.create(req, res , next);

        expect(res.json).toHaveBeenCalledWith({
            provider: "Order 1",
            status: status ,
            amount: 100,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            playgroundUrl: null,
            id: 1,
            orderId: 1
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(createCheckoutMock).toHaveBeenCalledWith(itemsFake , 1, "Ivo Ryan");
        expect(createCheckoutMock).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve buscar todas as orders existentes ", async () => {
         const req : any = {
            user: {
                id: 1
            }
        };


        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        getAllOrders.mockResolvedValueOnce([orderFake]);
        await checkoutController.getAllOrders(req, res , next);

        expect(res.json).toHaveBeenCalledWith([orderFake]);
        expect(getAllOrders).toHaveBeenCalledWith(1);
        expect(next).not.toHaveBeenCalled();
        expect(getAllOrders).toHaveBeenCalledTimes(1);
    });

    it("Deve Atualizar um Payment", async () => {
        const req : any = {
            user: {
                id: 1
            },
            params: {
                paymentId: "1"
            },
            body: {
                status: "PAID"
            }
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        updatedPayment.mockResolvedValueOnce({
            provider: "Order 1",
            status: "PAID",
            amount: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            playgroundUrl:  null,
            id: 1,
            orderId: 1
        });

        await checkoutController.updatedPayment(req , res, next);
        expect(updatedPayment).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
            provider: "Order 1",
            status: "PAID",
            amount: 100,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            playgroundUrl:  null,
            id: 1,
            orderId: 1
        });
        expect(updatedPayment).toHaveBeenCalledWith(1 , "PAID");
        expect(next).not.toHaveBeenCalled()
    });

    it("Deve chamar next quando ocorrer erro ao criar checkout", async () => {
        const req: any = {
            user: {
                name: "Ivo Ryan",
                id: 1
            },
            body: {
                items: itemsFake
            }
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        const error = new HttpError(400, "Erro ao criar checkout");

        createCheckoutMock.mockRejectedValueOnce(error);

        await checkoutController.create(req, res, next);

        expect(createCheckoutMock).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

});