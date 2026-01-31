import { Category } from "@prisma/client";

export interface CreateCategoryAttributes {
    name: string;
    position: number;
}

export interface ICategoryRepository {
    findMany: () => Promise<Category[]>;
    create: (attributes: CreateCategoryAttributes) => Promise<Category>;
    findUnique: (id: number) => Promise<Category | null>;
    update: (id: number, attributes: Partial<CreateCategoryAttributes>) => Promise<Category | null>;
    delete: (id: number) => Promise <Category | null>;
}