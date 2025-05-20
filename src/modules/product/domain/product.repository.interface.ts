import { ProductQueryDTO } from "../application/DTO/product.dto"
import {Product} from "./entities/product.entity"

export  interface IProductReposiory {
    create(product:Product):Promise<Product>
    findById(id:string):Promise<Product | null>
    getAll(query?:ProductQueryDTO):Promise<Product[]>
    update(id:string , product: Partial<Product>):Promise<Product | null>
    delete(id:string):Promise<boolean>
}


