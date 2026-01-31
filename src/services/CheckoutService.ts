import { HttpError } from "../errors/HttpError";
import { ICartProductRepositorie } from "../repositories/CartProductRepositorie";
import { ICheckoutRepositorie, ItemsProps, PaymentStatus } from "../repositories/CheckoutRepositorie";

export class CheckoutService {
    constructor(
        readonly checkoutRepositorie: ICheckoutRepositorie,
        readonly cartRepositorie: ICartProductRepositorie
    ){}

    async getAllOrders (userId: number) {
        const orders = await this.checkoutRepositorie.getOrders(userId);
        return orders
    }

    async updatedPayment (paymentId: number, status: PaymentStatus){
        if(!["PAID", "FAILED"].includes(status)) throw new HttpError(404, "invalid status");

        const payment = await this.checkoutRepositorie.updatePayment(paymentId, status);

        if(status === "PAID") await this.checkoutRepositorie.updateOrder(payment.orderId, "PAID");
        else if(status === "FAILED") await this.checkoutRepositorie.updateOrder(payment.orderId, "PENDING");

        return  payment 
    }

    async createCheckout (items: ItemsProps[], userId: number, customer?: string | null)  {
        if(!items || items.length === 0) throw new HttpError(404, "Items inválidos ");

        const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

        const order = await this.checkoutRepositorie.createOrder(total, items, userId ,customer);

        if(!order) throw new HttpError(404, "Order ainda não foi criado!")

        const payment = await this.checkoutRepositorie.createPayment(order.id, total);
        await this.cartRepositorie.cleanCart(userId);

        return payment
        
    }
}