export interface ListCatalog {
    id: string;
    description: string;
}

export interface PagedParams {
    pageNumber: number;
    pageSize: number;
}

export interface CatalogParams extends PagedParams {
    type: string;
    description: string;
}