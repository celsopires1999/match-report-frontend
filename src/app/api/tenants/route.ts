import { TenantController } from "@/backend/tenant/tenant-controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const controller = new TenantController();
    return controller.create(request);
}

// export function GET(request: Request) {
//     const { searchParams } = new URL(request.url);
//     return controller.search(searchParams);
// }
