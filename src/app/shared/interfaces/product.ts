export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    category_id: number;
    price: any;
    stock: number;
    image: string;
    created_at?: string;
    updated_at?: string;
    editing?: boolean;
}
