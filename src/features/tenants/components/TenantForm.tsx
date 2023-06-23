import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import { Tenant } from "@/types/Tenant";
import Link from "next/link";

type Props = {
  tenant: Tenant;
  isLoading?: boolean;
  isDisabled?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function TenantForm({
  tenant,
  isLoading = false,
  isDisabled = false,
  handleChange,
  handleSubmit,
}: Props) {
  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ "& .MuiTextField-root": { my: 2 } }}>
            {/* Name */}
            <FormControl fullWidth>
              <TextField
                variant="outlined"
                required
                value={tenant.name}
                label="Name"
                name="name"
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </Grid>
        {/* Buttons */}
        <Box display="flex" sx={{ my: 2 }} gap={2}>
          {/* Back */}
          <Button variant="contained" LinkComponent={Link} href="/tenants">
            Back
          </Button>
          {/* Save */}
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={isDisabled || isLoading}
          >
            {isLoading ? "Loading..." : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
