import axios from "axios";
import { cookies } from "next/headers";

// Get the environment variable (must start with NEXT_PUBLIC_)

export const axiosInstance = axios.create({
  baseURL:  "https://engrhachnayenahdmed-api.vercel.app/api",
});

axiosInstance.interceptors.request.use(
  async function (config) {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const resp = error.response;
    if (resp?.data && typeof resp.data === "object" && "message" in resp.data) {
      error.message = resp.data.message;
    }
    return Promise.reject(error);
  }
);
