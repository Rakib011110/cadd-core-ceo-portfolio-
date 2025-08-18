"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { FieldValues } from 'react-hook-form';
import { axiosInstance } from "@/lib/AxiosInstance";
import { IApiError, IDecodedToken } from "@/lib/types";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      (await cookies()).set("accessToken", data?.data?.accessToken);
      (await cookies()).set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: unknown) {
    const apiError = error as IApiError;
    // Extract the error message from the response
    const errorMessage = apiError.response?.data?.message || 
                        apiError.response?.data?.error || 
                        apiError.message || 
                        "Registration failed. Please try again.";
    
    // Return an error object that can be safely passed to client
    return {
      success: false,
      error: errorMessage,
      statusCode: apiError.response?.status || 500
    };
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      (await cookies()).set("accessToken", data.data.accessToken);
      (await cookies()).set("refreshToken", data.data.refreshToken);
    }

    return data;
  } catch (error: unknown) {
    const apiError = error as IApiError;
    // Extract the error message from the response
    const errorMessage = apiError.response?.data?.message || 
                        apiError.response?.data?.error || 
                        apiError.message || 
                        "Login failed. Please try again.";
    
    // Return an error object that can be safely passed to client
    return {
      success: false,
      error: errorMessage,
      statusCode: apiError.response?.status || 500
    };
  }
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;

  let decodedToken: IDecodedToken | null = null;

  if (accessToken) {
    decodedToken = jwtDecode<IDecodedToken>(accessToken);

    return {
      _id: decodedToken._id,
      name: decodedToken.name,
      email: decodedToken.email,
      mobileNumber: decodedToken.mobileNumber,
      role: decodedToken.role,
      status: decodedToken.status,
      emailVerified: decodedToken.emailVerified,
      profilePhoto: decodedToken.profilePhoto,
    };
  }

  return null;
};