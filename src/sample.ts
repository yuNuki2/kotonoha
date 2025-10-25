import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isJsonObject, isNumber, isString } from "./helper";
import type { JsonObject, JsonValue } from "./types";

interface Options {
	input?: string | Record<string, string> | undefined;
	output?: string | undefined;
}

const PLURAL_REGEX = /(^.+)#(zero|one|two|few|many|other)$/;

export function main(options: Options = {}) {
	const jsonString = readFileSync(path.join(__dirname, "sample.json")).toString();
	const source: JsonObject = JSON.parse(jsonString);
	const result: Record<string, unknown> = {};

	setObj(source, result);

	// TODO: 埋め込みかつpluralの場合のみPrettifyを追加
	// pluralの場合、PluralParamsを追加
	// それを判定するフラグを追加
	writeFileSync(
		path.join(__dirname, "../example/src/i18n/index.ts"),
		`
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export interface PluralParams {
	count: number;
	included?: boolean | undefined;
	type?: "cardinal" | "ordinal" | undefined;
}
  
export interface Result ${JSON.stringify(
			result,
			// TODO: この方法でいいのか？
			(_, value) => {
				if (typeof value === "string") {
					return `@@${value}@@`;
				}
				return value;
			},
			2,
		).replace(/"@@(.*?)@@"/g, "$1")}`,
	);

	function setObj(source: JsonObject, dest: Record<string, unknown>) {
		for (const [key, value] of Object.entries(source)) {
			const paths = key.split(".");
			setPath(dest, paths, value, key);
		}

		function setPath(
			obj: Record<string, any>,
			paths: string[],
			value: JsonValue,
			fullKey: string,
		) {
			for (let i = 0; i < paths.length; i++) {
				const key = paths[i];
				if (key === undefined) continue;
				if (i === paths.length - 1) {
					if (isJsonObject(value)) {
						if (!obj[key]) {
							obj[key] = {};
						}

						// NOTE: 元の実装
						// setObj(value, obj[key], key);

						for (const [key2, value2] of Object.entries(value)) {
							const paths = key2.split(".");
							setPath(obj[key], paths, value2, `${fullKey}.${key2}`);
						}
					} else {
						// NOTE: 重複キーが存在する場合
						if (hasPath(result, fullKey.split("."))) {
							throw new Error(`Duplicated Key: ${fullKey}`);
						}
						// NOTE: 文字列の場合
						else if (isString(value)) {
							const matches = Array.from(value.matchAll(/\{([^}]+)\}/g));
							const match = key.match(PLURAL_REGEX);
							const plural = match !== null;
							const entries: Array<readonly [`$${string}`, "string"]> = [];
							for (const match of matches) {
								const key = match[1]?.trim();
								if (!key || (plural && key === "count")) continue;
								entries.push([`$${key}`, "string"]);
							}
							const params = JSON.stringify(Object.fromEntries(entries)).replace(
								/\\|"/g,
								"",
							);

							if (entries.length > 0 && plural) {
								const pluralKey = match[1];
								if (!pluralKey) throw new Error("plural key not found");
								obj[pluralKey] = `(params: Prettify<${params} & PluralParams>) => string`;
							}
							// NOTE: プレースホルダーが存在する場合
							else if (entries.length > 0) {
								// NOTE: プレースホルダーが１つの場合、単一引数にする。
								if (entries.length === 1) {
									obj[key] = `(${entries[0]?.join(":")}) => string`;
								} else {
									obj[key] = `(params: ${params}) => string`;
								}
							} else if (plural) {
								const pluralKey = match[1];
								if (!pluralKey) throw new Error("plural key not found");
								obj[pluralKey] = `(params: PluralParams) => string`;
							} else {
								obj[key] = "string";
							}
							// NOTE: 数値の場合
						} else if (isNumber(value)) {
							obj[key] = "number";
							// NOTE: 想定していない型
						} else {
							console.log(JSON.stringify(obj, null, 2));
							throw new Error(`Unsupported Type: ${fullKey} is ${typeof value}`);
						}
					}
				} else {
					if (!(key in obj) || !isJsonObject(obj[key])) {
						obj[key] = {};
					}
					obj = obj[key];
				}
			}
		}
	}
}

export function getPath(obj: Record<string, any>, keys: string[]): any {
	return keys.reduce((o, key) => {
		if (o && key in o) {
			return o[key];
		}
		return undefined;
	}, obj);
}

function hasPath(obj: Record<string, any>, keys: string[]): boolean {
	const value = getPath(obj, keys);
	return value !== undefined;
}
