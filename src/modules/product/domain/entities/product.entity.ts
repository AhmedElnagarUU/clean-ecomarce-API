export class Product {
    private _id?: string;
    private _name: string;
    private _description: string;
    private _slug: string;
    private _sku: string;
    private _price: number;
    private _stock: number;
    private _category: string;
    private _images: string[];
    private _status: 'active' | 'inactive';
    private _createdAt?: Date;
    private _updatedAt?: Date;

    constructor(
        name: string,
        description: string,
        price: number,
        sku: string,
        stock: number,
        category: string,
        images: string[],
        status: 'active' | 'inactive' = 'active',
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this._name = name;
        this._description = description;
        this._price = price;
        this._sku = sku;
        this._stock = stock;
        this._category = category;
        this._images = images;
        this._status = status;
        this._id = id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._slug = this.generateSlug(name);
    }

    // Getters
    get id(): string | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get slug(): string {
        return this._slug;
    }

    get price(): number {
        return this._price;
    }

    get sku(): string {
        return this._sku;
    }

    get stock(): number {
        return this._stock;
    }

    get category(): string {
        return this._category;
    }

    get images(): string[] {
        return [...this._images];
    }

    get status(): 'active' | 'inactive' {
        return this._status;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    // Private validation methods
    private static validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Product name cannot be empty');
        }
    }

    private static validateDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw new Error('Product description cannot be empty');
        }
    }

    private static validatePrice(price: number): void {
        if (price < 0) {
            throw new Error('Price cannot be negative');
        }
    }

    private static validateStock(stock: number): void {
        if (stock < 0) {
            throw new Error('Stock cannot be negative');
        }
    }

    private static validateCategory(category: string): void {
        if (!category || category.trim().length === 0) {
            throw new Error('Category cannot be empty');
        }
    }

    private static validateImages(images: string[]): void {
        if (!Array.isArray(images) || images.length === 0) {
            throw new Error('Product must have at least one image');
        }
    }

    private static generateSku(sku: string): string {
        if (!sku || sku.trim().length === 0) {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            return `SKU-${timestamp}-${random}`;
        }
        return sku;
    }

    // Setters with validation
    set name(value: string) {
        Product.validateName(value);
        this._name = value;
        this._slug = this.generateSlug(value);
    }

    set description(value: string) {
        Product.validateDescription(value);
        this._description = value;
    }

    set price(value: number) {
        Product.validatePrice(value);
        this._price = value;
    }

    set stock(value: number) {
        Product.validateStock(value);
        this._stock = value;
    }

    set category(value: string) {
        Product.validateCategory(value);
        this._category = value;
    }

    set images(value: string[]) {
        Product.validateImages(value);
        this._images = [...value];
    }

    set status(value: 'active' | 'inactive') {
        this._status = value;
    }

    set sku(value: string) {
        this._sku = Product.generateSku(value);
    }

    // Business logic methods
    public isInStock(): boolean {
        return this._stock > 0;
    }

    public updateStock(quantity: number): void {
        const newStock = this._stock + quantity;
        if (newStock < 0) {
            throw new Error('Insufficient stock');
        }
        this._stock = newStock;
    }

    public isActive(): boolean {
        return this._status === 'active';
    }

    public activate(): void {
        this._status = 'active';
    }

    public deactivate(): void {
        this._status = 'inactive';
    }

    // Helper methods
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Static factory methods
    public static create(
        name: string,
        description: string,
        price: number,
        sku: string,
        stock: number,
        category: string,
        images: string[],
        status: 'active' | 'inactive' = 'active'
    ): Product {
        // Validate all inputs before creating the product
        Product.validateName(name);
        Product.validateDescription(description);
        Product.validatePrice(price);
        Product.validateStock(stock);
        Product.validateCategory(category);
        Product.validateImages(images);
        
        // Generate SKU if needed
        sku = Product.generateSku(sku);

        // Create and return the product with validated data
        return new Product(
            name,
            description,
            price,
            sku,
            stock,
            category,
            images,
            status
        );
    }

    // Data transfer object methods
    public toDTO() {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            slug: this._slug,
            sku: this._sku,
            price: this._price,
            stock: this._stock,
            category: this._category,
            images: [...this._images],
            status: this._status,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt
        };
    }
} 