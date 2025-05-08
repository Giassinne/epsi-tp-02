export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    enrichedDescription?: string;
  }
  
  export interface EnrichmentOptions {
    tone?: string;
    length?: string;
  }