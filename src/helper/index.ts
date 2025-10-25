import type { JsonObject, JsonValue } from "../types";

export function isArray(value: unknown): value is Array<any> {
	return Array.isArray(value);
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

export function isNull(value: unknown): value is null {
	return value === null;
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

export function isJsonObject(value: JsonValue): value is JsonObject | Array<JsonObject> {
	return !isNumber(value) && !isString(value) && !isBoolean(value) && !isNull(value);
}
