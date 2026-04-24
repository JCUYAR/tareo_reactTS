import axios, {type Method, type AxiosRequestConfig} from "axios";
import type { BaseResult } from "../../presentation/general/BaseResult";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http:localjost;6767",
    timeout: 10000,
    headers : {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use((config) => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            const { token } = JSON.parse(auth);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// export async function fetchData<T>(
//     url: string,
//     method: Method,
//     data?: any,
//     config?: AxiosRequestConfig
// ): Promise<BaseResult<T>> {

//     const response = await axiosInstance.request<BaseResult<T>>({
//         url,
//         method,
//         data: method !== "GET" ? data : undefined,
//         params: method === "GET" ? data : undefined,
//         ...config,
//     });

//     return response.data;
// }

export async function fetchData<T>(
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
): Promise<BaseResult<T>> {

    const response = await axiosInstance.request<BaseResult<T>>({
        url,
        method,
        data: method !== "GET" ? data : undefined,
        params: method === "GET" ? data : undefined,
        ...config,
    });

    return response.data;
    // const result = response.data;

    // if (!result.success) {
    //     const message =
    //         result.errors?.[0]?.message ||
    //         "Unexpected server error";

    //     throw new Error(message);
    // }

    // return result;
}