export class Product {
    private _id?: string;
    private _name: string;
    private _description: string;
    private _slug: string;
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

    // Setters with validation
    set name(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('Product name cannot be empty');
        }
        this._name = value;
        this._slug = this.generateSlug(value);
    }

    set description(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('Product description cannot be empty');
        }
        this._description = value;
    }

    set price(value: number) {
        if (value < 0) {
            throw new Error('Price cannot be negative');
        }
        this._price = value;
    }

    set stock(value: number) {
        if (value < 0) {
            throw new Error('Stock cannot be negative');
        }
        this._stock = value;
    }

    set category(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('Category cannot be empty');
        }
        this._category = value;
    }

    set images(value: string[]) {
        if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Product must have at least one image');
        }
        this._images = [...value];
    }

    set status(value: 'active' | 'inactive') {
        this._status = value;
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
        stock: number,
        category: string,
        images: string[],
        status: 'active' | 'inactive' = 'active'
    ): Product {
        return new Product(
            name,
            description,
            price,
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