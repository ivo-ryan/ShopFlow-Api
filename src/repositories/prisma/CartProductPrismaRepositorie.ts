import { CartProduct, Product, } from "@prisma/client";
import { ICartProductRepositorie } from "../CartProductRepositorie";
import { prisma } from "../../database/database";

export class CartProductPrismaRepositorie implements ICartProductRepositorie {

    async cartIdExists (userId: number) {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: { cart: { select: { id: true } } }
        });

        return user.cart?.id ?? (await prisma.cart.create({ data: { userId } })).id;
    }

    async addProductInCart (userId: number, productId: number):  Promise<CartProduct>{
       const  cartId = await this.cartIdExists(userId);
        return prisma.cartProduct.create({ 
            data: { 
                cartId,
                productId
             }
         })
    }

    async removeProductInCart (userId: number, productId: number):  Promise<CartProduct>{
        const  cartId = await this.cartIdExists(userId);
        return prisma.cartProduct.delete({ where: { cartId_productId: { cartId, productId } } });
    }

    async getProductsInCart (userId: number):  Promise< CartProduct[]>{
        const cartId = await this.cartIdExists(userId);
        return prisma.cartProduct.findMany({
            where: { cartId },
            include: {
                product: {
                    include: { images: true }
                }
            }
        })
    }

    productExists (productId: number):  Promise<Product | null>{
        return prisma.product.findUnique({ where: { id: productId } });
    }

    async cartIdAlreadyExists (userId: number){
        const cartId = await prisma.user.findUnique({ where: { id: userId } , include: { cart: true } });
        return cartId
    }

    async productAlreadyInCart (userId: number, productId: number) : Promise<CartProduct | null>{
        const cartId = await this.cartIdAlreadyExists(userId);      
        if(!cartId?.cart) {
            return null
        }else{
            return prisma.cartProduct.findUnique({ where: { cartId_productId: { cartId: cartId.cart.id, productId } } });
        }
    }

    async updateQuantityInCart (userId: number, productId: number, change: number): Promise<CartProduct | null>{
        const productCart = await this.productAlreadyInCart(userId, productId);
        const cartId = await this.cartIdAlreadyExists(userId);      
        if(!cartId?.cart || !productCart?.quantity) {
            return null
        }

        const newQuatity = productCart.quantity + change;

        if( newQuatity <= 0  ){
            await prisma.cartProduct.delete({
                 where: { cartId_productId: {
                    cartId: cartId.cart.id,
                    productId
                } }
            });

            return null
        }


        return prisma.cartProduct.update({
             where: { cartId_productId: {
                    cartId: cartId.cart.id,
                    productId
                } },
                data: { quantity: newQuatity }
        });
        
    }

    async cleanCart (userId: number) : Promise<void>{
       const cartId = await this.cartIdAlreadyExists(userId);

       if(!cartId?.cart) return ;

       await prisma.cartProduct.deleteMany({
            where:{
                cartId: cartId.cart.id
            }
        })
    }

}