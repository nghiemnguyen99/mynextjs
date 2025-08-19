import { NextRequest, NextResponse } from "next/server";
import { type CreateTenantInput, validateCreateTenantInput } from "@/lib/tenantStore";
import { randomUUID } from "crypto";
import { Tenant } from "@/app/models/Tenant";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDocumentClient } from "@/lib/dynamoClient";
import { TENANTS_TABLE } from "@/lib/constants";

export async function GET() {
	try {
		const ddb = getDynamoDocumentClient();
        const tableName = TENANTS_TABLE;
		const res = await ddb.send(new ScanCommand({ TableName: tableName }));
        const tenants = (res.Items as Tenant[]) ?? [];
		return NextResponse.json(tenants);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
        const ddb = getDynamoDocumentClient();
        const tableName = TENANTS_TABLE;
		const body = (await request.json()) as Partial<CreateTenantInput>;
		const payload = body as CreateTenantInput;
		validateCreateTenantInput(payload);
        const now = new Date().toISOString();
        const tenant: Tenant = {
            id: randomUUID(),
            created_at: now,
            updated_at: now,
            ...payload,
          } as Tenant;
          await ddb.send(new PutCommand({ TableName: tableName, Item: tenant }));
          return tenant;
		return NextResponse.json(tenant, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}


