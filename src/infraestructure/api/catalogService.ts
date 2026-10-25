import type { BaseResult } from "../../presentation/general/BaseResult";
import type { PagedResponse } from "../../presentation/general/PagedResponse";
import type { CatalogParams, ListCatalog, ListOneCatalog } from "../../presentation/Lists/catalog.types";
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

const addAreaService = (payload: string) => {
  const body = {
    description: payload
  }

  const response = fetchData<BaseResult<boolean>> (
    "catalog/AddArea",
    "POST",
    body
  );

  return response;
}

const updateAreaService = (id: number, description: string) => {
  const body = {
    id: id,
    description: description
  }

  const response = fetchData<BaseResult<boolean>> (
    "catalog/UpdateArea",
    "PUT",
    body
  );

  return response;
}

const deleteAreaService = (id: number) => {
  const body = {
    id: id
  }

  const response = fetchData<BaseResult<boolean>> (
    "catalog/DeleteArea",
    "DELETE",
    body
  );

  return response;
}

const addStatusService = (payload: string) => {
  const body = {
    description: payload
  }

  const response = fetchData<BaseResult<boolean>> (
    "catalog/AddStatus",
    "POST",
    body
  );

  return response;
}

const getOneById = (type: string, id: string) => {
  const response = fetchData<BaseResult<ListOneCatalog[]>> (
    `catalog/GetOneById/${type}&${id}`,
    "GET"
  );
  return response;
}

export {
    getPagedListCategory,
    addAreaService,
    updateAreaService,
    deleteAreaService,
    addStatusService,
    getOneById
}