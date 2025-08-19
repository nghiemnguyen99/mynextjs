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
