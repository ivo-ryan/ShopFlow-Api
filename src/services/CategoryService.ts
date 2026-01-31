import { HttpError } from "../errors/HttpError";
import { CreateCategoryAttributes, ICategoryRepository } from "../repositories/CategoryRepositorie";

export class CategoryService {
    constructor( readonly categoryRepositorie: ICategoryRepository ){}

    async findAllCategory (){
        const categories = await this.categoryRepositorie.findMany();
        return categories;
    }

    async createCategory ( attributes: CreateCategoryAttributes ) {
        const newCategory = await this.categoryRepositorie.create(attributes);
        return newCategory;
    }

    async categoryExists (id: number) {
        const category = await this.categoryRepositorie.findUnique(id);
        if(!category) throw new HttpError(404, "Categoria não foi encontrada!");
    }

    async findByIdCategory (id: number) {
        await this.categoryExists(id);
        const category = await this.categoryRepositorie.findUnique(id);
        return category;
    }

    async updateCategory( id:number, attributes: Partial<CreateCategoryAttributes> ) {
        await this.categoryExists(id);
        const updateCategory = await this.categoryRepositorie.update(id, attributes);
        return updateCategory;
    }

    async deleteCategory(id: number) {
        await this.categoryExists(id);
        const removeCategory = await this.categoryRepositorie.delete(id);
        return removeCategory;
    }
}