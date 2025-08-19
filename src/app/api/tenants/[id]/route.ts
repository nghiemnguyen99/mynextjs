import { NextRequest, NextResponse } from "next/server";
import { DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDocumentClient } from "@/lib/dynamoClient";
import { TENANTS_TABLE } from "@/lib/constants";
import { Tenant } from "@/app/models/Tenant";

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const ddb = getDynamoDocumentClient();
        const tableName = TENANTS_TABLE;
		const body = (await request.json()) as Partial<Pick<Tenant, "email" | "name">>;

		const { email, name } = body;
		if (typeof email !== "string" || typeof name !== "string" || !email.trim() || !name.trim()) {
			return NextResponse.json(
				{ error: "Missing required fields: email and name" },
				{ status: 400 }
			);
		}

		const expressions: string[] = [];
		const names: Record<string, string> = {};
		const values: Record<string, unknown> = {};

		if (email !== undefined) {
			names["#email"] = "email";
			values[":email"] = email;
			expressions.push("#email = :email");
		}
		if (name !== undefined) {
			names["#name"] = "name";
			values[":name"] = name;
			expressions.push("#name = :name");
		}

		names["#updated_at"] = "updated_at";
		values[":updated_at"] = new Date().toISOString();
		expressions.push("#updated_at = :updated_at");

		const res = await ddb.send(
			new UpdateCommand({
				TableName: tableName,
				Key: { id: params.id },
				UpdateExpression: `SET ${expressions.join(", ")}`,
				ExpressionAttributeNames: names,
				ExpressionAttributeValues: values,
				ConditionExpression: "attribute_exists(id)",
				ReturnValues: "ALL_NEW",
			})
		);
		return NextResponse.json(res.Attributes as Tenant);
	} catch (error) {
		if (error && typeof error === "object" && (error as any).name === "ConditionalCheckFailedException") {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const ddb = getDynamoDocumentClient();
        const tableName = TENANTS_TABLE;
		const ok = await ddb.send(new DeleteCommand({ TableName: tableName, Key: { id: params.id } }));
		if (!ok.Attributes) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		return NextResponse.json({ success: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}


