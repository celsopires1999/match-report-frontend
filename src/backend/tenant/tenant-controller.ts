import { CreateTenantUseCase } from "@/backend/tenant/create-tenant.use-case";
import { NextRequest, NextResponse } from "next/server";
import { errorHandling } from "../@seedwork/errors";
import { CreateTenantDto } from "./create-tenant.dto";

export class TenantController {
  async create(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();

    try {
      const createTenantDto = CreateTenantDto.validate(body)
      const createUseCase = new CreateTenantUseCase();
      const output = await createUseCase.execute(createTenantDto)
      return NextResponse.json(output)
    } catch (e) {
      return errorHandling(e)
    }
  }
}
