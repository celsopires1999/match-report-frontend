import { TenantForm } from "@/features/tenants/components/TenantForm";
import { Tenant, TenantPayload } from "@/types/Tenant";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  initialState as tenantInitialState,
  useCreateTenantMutation,
} from "@/features/tenants/TenantsSlice";
import { useSnackbar } from "notistack";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

export function TenantCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const [createTenant, statusCreateTenant] = useCreateTenantMutation();
  const [tenantState, setTenantState] =
    useState<TenantPayload>(tenantInitialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenantState({ ...tenantState, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createTenant(tenantState);
  }

  useEffect(() => {
    if (statusCreateTenant.isSuccess) {
      enqueueSnackbar(`Tenant created successfully`, { variant: "success" });
      console.log(`Tenant created successfully:`, statusCreateTenant.data);

      setTenantState({ name: "" });
    }
    if (statusCreateTenant.error) {
      enqueueSnackbar(`Tenant not created`, { variant: "error" });
    }
  }, [enqueueSnackbar, statusCreateTenant.error, statusCreateTenant.isSuccess]);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Tenant</Typography>
          </Box>
        </Box>
        <TenantForm
          tenantPayload={tenantState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          isLoading={statusCreateTenant.isLoading}
          isDisabled={statusCreateTenant.isLoading}
        />
      </Paper>
    </Box>
  );
}
