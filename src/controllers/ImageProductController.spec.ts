import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductService } from "../services/ProductService";
import { ImageProductController } from "./ImageProductController";
import { HttpError } from "../errors/HttpError";


const productServiceMock = {
    addImage: vi.fn(),
    updateImage: vi.fn(),
    deleteImage: vi.fn()
} as unknown as ProductService;

const addImage = vi.mocked(productServiceMock.addImage);
const updatedImage = vi.mocked(productServiceMock.updateImage);
const deletedImage = vi.mocked(productServiceMock.deleteImage);

const imageFake = {
    url: "htps://imagefake.com",
    productId: 1,
    altText: "image exemplo"
}

describe("Image Product Controller", async () => {

    const imageProductControllerMock = new ImageProductController(productServiceMock);
    beforeEach(() => {
        vi.clearAllMocks()
    });

    it("Deve adicionar uma imagem ao produto ", async () => {
        const req: any = {
            body: imageFake
        }

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        addImage.mockResolvedValueOnce({id: 1, ...imageFake});
        await imageProductControllerMock.addImage(req, res , next);

        expect(res.json).toHaveBeenCalledWith({id: 1 , ...imageFake});
        expect(res.status).toHaveBeenCalledWith(201);
        expect(addImage).toHaveBeenCalledWith(imageFake);
        expect(addImage).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve lançar um erro e chamar o next", async () => {
        const req: any = {
            body: imageFake
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        const error = new HttpError(400, "Erro ao criar uma nova image")

        addImage.mockRejectedValueOnce(error);

        await imageProductControllerMock.addImage(req, res, next);

        expect(res.json).not.toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalledTimes(1);
        expect(addImage).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
    });

    it("Deve atualizar uma image existente ", async () => {
        const req: any = {
            body: {
                productId: 2
            },
            params: {
                id: "1"
            }
        }

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        updatedImage.mockResolvedValueOnce({id: 1, productId: 2, altText: "exemplo", url: "https://image.com"})
        await imageProductControllerMock.updateImage(req, res , next);

        expect(res.json).toHaveBeenCalledWith({id: 1, productId: 2, altText: "exemplo", url: "https://image.com"});
        expect(updatedImage).toHaveBeenCalledWith(1, { productId: 2 });
        expect(updatedImage).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    it("Deve deletar uma imagem existente", async () => {
        const req: any = {
            params: {
                id: "1"
            }
        }

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const next = vi.fn();

        deletedImage.mockResolvedValueOnce({ id: 1, ...imageFake });
        await imageProductControllerMock.deleteImage(req, res, next);

        expect(res.json).toHaveBeenCalledWith({id: 1, ...imageFake});
        expect(deletedImage).toHaveBeenCalledWith(1);
        expect(deletedImage).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    })
});