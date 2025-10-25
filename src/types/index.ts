export type DotPaths<T> = {
	[K in keyof T & string]: T[K] extends Record<string, unknown>
		? `${K}.${DotPaths<T[K]>}`
		: K;
}[keyof T & string];

export type DotPathsAll<T> = {
	[K in keyof T & string]: T[K] extends Record<string, any>
		? K | `${K}.${DotPathsAll<T[K]>}`
		: K;
}[keyof T & string];

export type After<T extends string, Key extends string> = T extends `${Key}.${infer Rest}`
	? Rest
	: never;

export interface PluralParams {
	count: number;
	included?: boolean | undefined;
	type?: "cardinal" | "ordinal" | undefined;
}

export type JsonValue = string | number | boolean | null | JsonObject | Array<JsonObject>;
export type JsonObject = {
	[key: string]: JsonValue;
};
