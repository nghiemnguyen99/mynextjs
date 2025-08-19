export type TenantPlan = "ShiftOnly" | "Entry" | "Premium";
export type TenantStatus = "active" | "inactive";

export interface Tenant {
	id: string;
	name: string;
	email: string;
	plan: TenantPlan;
	tableau_url?: string;
	jwt?: string;
	status: TenantStatus;
	plan_start_date: string; // ISO 8601
	plan_end_date: string; // ISO 8601
	created_at: string; // ISO 8601
	updated_at: string; // ISO 8601
}

export type CreateTenantInput = Omit<
	Tenant,
	"id" | "created_at" | "updated_at"
>;

export type UpdateTenantInput = Partial<Omit<Tenant, "id" | "created_at">> & {
	id: string;
};

function assertValidPlan(plan: string): asserts plan is TenantPlan {
	if (plan !== "ShiftOnly" && plan !== "Entry" && plan !== "Premium") {
		throw new Error(
			"Invalid plan. Allowed values are 'ShiftOnly', 'Entry', 'Premium'"
		);
	}
}

function assertValidStatus(status: string): asserts status is TenantStatus {
	if (status !== "active" && status !== "inactive") {
		throw new Error("Invalid status. Allowed values are 'active', 'inactive'");
	}
}

function isValidIsoDate(input: string): boolean {
	return !Number.isNaN(Date.parse(input));
}

export function validateCreateTenantInput(input: CreateTenantInput): void {
	const { name, email, plan, status, plan_start_date, plan_end_date } = input;
	if (!name || !email || !plan || !status || !plan_start_date || !plan_end_date) {
		throw new Error(
			"Missing required fields: name, email, plan, status, plan_start_date, plan_end_date"
		);
	}
	assertValidPlan(plan);
	assertValidStatus(status);
	if (!isValidIsoDate(plan_start_date) || !isValidIsoDate(plan_end_date)) {
		throw new Error("plan_start_date and plan_end_date must be valid ISO 8601 dates");
	}
}

export function validateUpdateTenantInput(updates: Omit<UpdateTenantInput, "id">): void {
	if (updates.plan) assertValidPlan(updates.plan);
	if (updates.status) assertValidStatus(updates.status);
	if (updates.plan_start_date && !isValidIsoDate(updates.plan_start_date)) {
		throw new Error("plan_start_date must be a valid ISO 8601 date");
	}
	if (updates.plan_end_date && !isValidIsoDate(updates.plan_end_date)) {
		throw new Error("plan_end_date must be a valid ISO 8601 date");
	}
}


