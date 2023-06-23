import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseUrl = `http://lb-sumula-207865420.us-east-1.elb.amazonaws.com`;
export const baseUrl = `http://localhost:8081`;
export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Tenants"],
  endpoints: (builder) => ({}),
  baseQuery: fetchBaseQuery({ baseUrl }),
});
