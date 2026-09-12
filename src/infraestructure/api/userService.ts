import type { BaseResult } from "../../presentation/general/BaseResult";
import type { SelectDto } from "../../presentation/general/SelectDto"
import { fetchData } from "./fetchData"

const listUsers = async () => {
    const response = fetchData<BaseResult<SelectDto[]>> (
        "user/ListAllUser",
        "GET"
    );
    return response;
}


export {
    listUsers
}