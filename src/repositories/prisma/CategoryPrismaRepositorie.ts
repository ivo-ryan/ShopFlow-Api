import { Category } from "@prisma/client";
import { CreateCategoryAttributes, ICategoryRepository } from "../CategoryRepositorie";
import { prisma } from "../../database/database";

export class CategoryPrismaRepository implements ICategoryRepository{
    findMany () : Promise<Category[]>{
        return prisma.category.findMany();
    }

    create (attributes: CreateCategoryAttributes) : Promise<Category>{
        return prisma.category.create({ data: attributes });
    }

    findUnique (id: number) : Promise<Category | null>{
        return prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    include: { images: true }
                }
            }
        })
    }

    update (id: number, attributes: Partial<CreateCategoryAttributes>) : Promise<Category | null>{
        return prisma.category.update({ 
            where: { id },
            data: attributes
         });
    }

    delete (id: number) : Promise<Category | null>{
        return prisma.category.delete({ where: { id } });
    }

    
}