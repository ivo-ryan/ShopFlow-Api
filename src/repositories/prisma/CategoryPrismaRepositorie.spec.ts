import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../database/database";
import { CategoryPrismaRepository } from "./CategoryPrismaRepositorie";
import { CreateCategoryAttributes } from "../CategoryRepositorie";


vi.mock("../../database/database", () => ({
    prisma: {
        category: {
            findMany: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        }
    }
}));

const categoryAttributesFake: CreateCategoryAttributes = {
    name: "category 1",
    position: 1
}

describe("Category prisma repository", () => {
    const categoryPrismaRepositorie = new CategoryPrismaRepository();
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve chamar o findMany ", async () => {
        await categoryPrismaRepositorie.findMany();
        expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o craete ", async () => {
        await categoryPrismaRepositorie.create(categoryAttributesFake);
        expect(prisma.category.create).toHaveBeenCalledWith({
            data: {
                ...categoryAttributesFake
            }
        });
        expect(prisma.category.create).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o findUnique", async () => {
        await categoryPrismaRepositorie.findUnique(1);

        expect(prisma.category.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            },

            include: {
                products: {
                    include: { images: true }
                }
            }
        });
        expect(prisma.category.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve Chamar o update", async () => {
        await categoryPrismaRepositorie.update(1, categoryAttributesFake);

        expect(prisma.category.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: categoryAttributesFake 
        });
        expect(prisma.category.update).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar o delete", async () => {
        await categoryPrismaRepositorie.delete(1);

        expect(prisma.category.delete).toHaveBeenCalledWith({
            where: { id: 1 }
        });
        expect(prisma.category.delete).toHaveBeenCalledTimes(1);
    });
});