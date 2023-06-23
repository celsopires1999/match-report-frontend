import { TenantForm } from "@/features/tenants/components/TenantForm";
import { Tenant } from "@/types/Tenant";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  initialState as tenantInitialState,
  useCreateTenantMutation,
} from "@/features/tenants/TenantsSlice";
import { useSnackbar } from "notistack";

export function TenantCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const [createTenant, statusCreateTenant] = useCreateTenantMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenantState({ ...tenantState, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createTenant(tenantState);
  }

  const [tenantState, setTenantState] = useState<Tenant>(tenantInitialState);

  useEffect(() => {
    if (statusCreateTenant.isSuccess) {
      enqueueSnackbar(`Tenant created successfully`, { variant: "success" });
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
          tenant={tenantState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          isLoading={false}
          isDisabled={false}
        />
      </Paper>
    </Box>
  );
}
