export type Tenant = {
  id: string;
  name: string;
};

export type TenantPayload = {
  name: string
}

export type Result = Tenant;

export type Results = Tenant[];
