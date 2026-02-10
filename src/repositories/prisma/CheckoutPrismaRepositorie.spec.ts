import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../database/database";
import { CheckoutPrismaRepositorie } from "./CheckoutPrismaRepositorie";
import { ItemsProps } from "../CheckoutRepositorie";


vi.mock("../../database/database", () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
            create: vi.fn() ,
            update: vi.fn()
        },
        payment: {
            create: vi.fn() ,
            update: vi.fn()
        }
    }
}));

const items: ItemsProps[] = [
    {
        image: "image1",
        name: "Creatina",
        price: 100,
        productId: 1,
        quantity: 1
    }
]

describe("Checkout prisma repositorie", () => {
    const repository = new CheckoutPrismaRepositorie();
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve chamar o getOrders", async () => {
        await repository.getOrders(1);
        expect(prisma.order.findMany).toHaveBeenCalledWith({
            where: { userId: 1 },
            orderBy: {
                createdAt: "desc" 
                },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: true
                            }
                        }
                    }
                },
                payment: true
            }
        });
        expect(prisma.order.findMany).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o createOrder corretamente", async () => {
        await repository.createOrder(1 , items , 1 , "Ivo Ryan");
        expect(prisma.order.create).toHaveBeenCalledWith({
            data: {
                userId: 1,
                total: 1,
                customer: "Ivo Ryan",
                items:{
                    create: items.map(i => ({
                        productId: i.productId,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                        image: i.image
                    }))
                }
            },

            include: { items: true }
        });
        expect(prisma.order.create).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o createPayment corretamente", async () => {
        await repository.createPayment(1, 1 );
        expect(prisma.payment.create).toHaveBeenCalledWith({
            data: {
            orderId: 1,
            provider: "simulated",
            status: "PENDING",
            amount: 1
            },
            include: { order: true }
        });
        expect(prisma.payment.create).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o updatePayment corretamente", async () => {
        await repository.updatePayment(1, "PAID");
        expect(prisma.payment.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { status: "PAID" }
        });
        expect(prisma.payment.update).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o updateOrder corretamente", async () => {
        await repository.updateOrder(1, "CANCELLED");
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: {
                id: 1
            },
            data: {
                status: "CANCELLED"
            }
        });
        expect(prisma.order.update).toHaveBeenCalledTimes(1);
    });
});