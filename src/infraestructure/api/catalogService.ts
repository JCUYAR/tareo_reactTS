import type { PagedResponse } from "../../presentation/general/PagedResponse";
import type { CatalogParams, ListCatalog } from "../../presentation/Lists/catalog.types";
import { fetchData } from "./fetchData";

const getPagedListCategory = (
  request: CatalogParams
) => {
  const params = new URLSearchParams({
    pageNumber: request.pageNumber.toString(),
    pageSize: request.pageSize.toString(),
    type: request.type,
  });

  if (request.description) {
    params.append("description", request.description);
  }

  return fetchData<PagedResponse<ListCatalog[]>>(
    `catalog/GetPagedList?${params.toString()}`,
    "GET"
  );
};

export {
    getPagedListCategory
}