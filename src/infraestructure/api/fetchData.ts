import axios, {type Method, type AxiosRequestConfig} from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || "http:localjost;6767",
    timeout: 10000,
    headers : {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
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
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export async function fetchData<T> (
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const response = await axiosInstance.request({
            url,
            method,
            data: method === "GET" || method == "DELETE" ? undefined : data,
            params: method === 'GET' || method === 'DELETE' ? data : undefined,
            ...config,
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message
    }
}