import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// export const baseUrl = "http://lb-sumula-207865420.us-east-1.elb.amazonaws.com";
export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Tenants"],
  endpoints: (builder) => ({}),
  baseQuery: fetchBaseQuery({ baseUrl }),
});
