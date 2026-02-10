import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../database/database";
import { UserPrismaRepositorie } from "./UserPrismaRepositorie";
import { CreateUserAttributes } from "../UserRepositorie";

vi.mock("../../database/database", () => ({
    prisma: {
        user: {
            findMany: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        }
    }
}));

const userFake: CreateUserAttributes = {
    email: "user@example.com",
    name: "John Doe",
    password: "hashedPassword123"
};

describe("User prisma repositorie", () => {
    const repository = new UserPrismaRepositorie();
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Deve chamar findMany corretamente", async () => {
        await repository.findMany();
        expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar create corretamente", async () => {
        await repository.create(userFake);
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: userFake
        });
        expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar findUnique corretamente by email", async () => {
        await repository.findUnique("user@example.com");
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: "user@example.com" },
            include: { cart: { include: { products: { include: { product: true } } } } }
        });
        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar findById corretamente", async () => {
        await repository.findById(1);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        });
        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar update corretamente", async () => {
        await repository.update(1, { name: "Jane Doe" });
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { name: "Jane Doe" }
        });
        expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });

    it("Deve chamar delete corretamente", async () => {
        await repository.delete(1);
        expect(prisma.user.delete).toHaveBeenCalledWith({
            where: { id: 1 }
        });
        expect(prisma.user.delete).toHaveBeenCalledTimes(1);
    });

});
