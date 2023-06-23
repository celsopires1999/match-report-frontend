import { TenantPayload, Result, Results } from "@/types/Tenant";
import { apiSlice } from "@/features/api/apiSlice";

const endpointUrl = "/tenants";

export const initialState: TenantPayload = {
    name: ""
};

function getTenants() {
    return `${endpointUrl}`;
}

function getTenant({ id }: { id: string }) {
    return {
        url: `${endpointUrl}/${id}`,
        method: "GET",
    };
}

function createTenant(tenantPayload: TenantPayload) {
    return { url: endpointUrl, method: "POST", body: tenantPayload };
}

function updateTenant({
    id,
    tenantPayload,
}: {
    id: string;
    tenantPayload: TenantPayload;
}) {
    return {
        url: `${endpointUrl}/${id}`,
        method: "PUT",
        body: tenantPayload,
    };
}

function deleteTenant({ id }: { id: string }) {
    return {
        url: `${endpointUrl}/${id}`,
        method: "DELETE",
    };
}

export const tenantsApiSlice = apiSlice.injectEndpoints({
    endpoints: ({ query, mutation }) => ({
        getTenants: query<Results, void>({
            query: getTenants,
            providesTags: ["Tenants"],
        }),
        getTenant: query<Result, { id: string }>({
            query: getTenant,
            providesTags: ["Tenants"],
        }),
        createTenant: mutation<Result, TenantPayload>({
            query: createTenant,
            invalidatesTags: ["Tenants"],
        }),
        updateTenant: mutation<Result, { id: string; tenantPayload: TenantPayload }>({
            query: updateTenant,
            invalidatesTags: ["Tenants"],
        }),
        deleteTenant: mutation<{}, { id: string }>({
            query: deleteTenant,
            invalidatesTags: ["Tenants"],
        }),
    }),
});

export const {
    useCreateTenantMutation,
    useUpdateTenantMutation,
    useDeleteTenantMutation,
    useGetTenantQuery,
    useGetTenantsQuery,
} = tenantsApiSlice;
