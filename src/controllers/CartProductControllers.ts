import { Handler } from "express";
import { CartProductService } from "../services/CartService";
import { CartProductRequestSchema } from "./schema/CartProductRequestSchema";
import { AuthenticatedRequest } from "../middlewares/auth";

export class CartProductController {
    constructor(readonly cartProductService: CartProductService) {}

    getAllProducts: Handler = async ( req:AuthenticatedRequest , res , next  ) => {
        try {    
            const userId = req.user!.id;
            const productsInCart = await this.cartProductService.getAllProducts(userId);
            res.json(productsInCart)
        } catch (error) {
            next(error)
        }
    }

    addProduct: Handler = async ( req:AuthenticatedRequest , res , next ) => {
        try {
            const userId = req.user!.id;
            const { productId , change } = CartProductRequestSchema.parse(req.body);
            const newProductInCart = await this.cartProductService.addProductCart(userId, productId, change);
            res.status(201).json(newProductInCart);
        } catch (error) {
            next(error)
        }
    }

    deleteProduct: Handler = async ( req:AuthenticatedRequest , res , next ) => {
        try {
            const userId = req.user!.id;
            const  productId  = +req.params.id;
            const deleteProductIncart = await this.cartProductService.removeProductInCart(userId, productId);
            res.json(deleteProductIncart); 
        } catch (error) {
            next(error)
        }
    }
}