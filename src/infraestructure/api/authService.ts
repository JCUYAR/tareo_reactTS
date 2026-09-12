import type { AuthResponse, LoginBody, UserData } from "../../presentation/forms/loginForm.types"
import type { BaseResult } from "../../presentation/general/BaseResult";
import { fetchData } from "./fetchData";

const authenticateService = (payload: LoginBody) => {
    const body = {
        username: payload.userName,
        password: payload.password
    }

    const response = fetchData<BaseResult<AuthResponse>> (
        "/auth/login",
        "POST",
        body
    );
    return response;
}

const getUserDataById = (id: number) => {
  return fetchData<BaseResult<UserData[]>>(
    `user/GetUserById/${id}`,
    "GET"
  );
};

export {
    authenticateService,
    getUserDataById
}