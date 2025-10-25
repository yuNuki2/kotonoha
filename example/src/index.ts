import { getPath } from "../../src/sample";
import type { PluralParams } from "../../src/types";
import type { Result } from "./i18n";

interface Options<K extends keyof Result> {
	locale?: string | undefined;
	namespace?: K | undefined;
}

function embed(message: string, key: string, value: string): string {
	const regex = new RegExp(`{${key}}`);
	return message.replaceAll(regex, value);
}

function createTranslations<K extends keyof Result>(namespace?: K): Result[K];
function createTranslations<K extends keyof Result>(options: Options<K>): Result[K];
function createTranslations<K extends keyof Result>(
	namespaceOrOptions: K | Options<K> = {},
): Result[K] {
	// NOTE: どうやって取得する？
	const defaultLocale = "";
	let locale: string | undefined = defaultLocale;
	let namespace: K | undefined;
	if (typeof namespaceOrOptions === "string") {
		namespace = namespaceOrOptions;
	} else {
		locale = namespaceOrOptions.locale;
		namespace = namespaceOrOptions.namespace;
	}

	// const dictionary = fetch(`/${locale}/${namespace}`);
	const dictionary = {} as any;

	const keys = namespace?.split(".");

	let part: Record<string, string> | undefined = dictionary;
	if (keys) {
		// NOTE: namespace で指定した階層までの辞書
		part = getPath(dictionary, keys);

		if (!part) {
			throw new Error();
		}
	}

	const interporate = (key: string, params: Record<string, string>): string => {
		let message = part?.[key];
		if (!message) {
			throw new Error(`message not found: ${key}`);
		}
		for (const [key, value] of Object.entries(params)) {
			message = embed(message, key.replace("$", ""), value);
		}
		return message;
	};

	const pluralize = (key: string, params: PluralParams): string => {
		const { count, included = false, type } = params;
		const rules = new Intl.PluralRules(locale, { type });
		const ldml = rules.select(count);
		let message: string = dictionary[`${key}#${ldml}`];
		if (message === undefined) {
			throw new Error("message not found");
		}
		if (included) {
			message = message.replace(/a/g, "");
		}
		return message;
	};

	const customize = <T>(key: string, params: Record<string, (chunk: string) => T>) => {
		for (const [key, render] of Object.entries(params)) {
		}
	};

	return new Proxy(part as Result[K], {
		get: (target, p, receiver) => {
			return Reflect.get(target, p, receiver);
		},
	});
}

async function createTranslationsProxy(getLocale: () => string | Promise<string>) {
	// TODO: デフォルトロケールの取得
	let defaultLocale = getLocale();

	if (defaultLocale instanceof Promise) {
		defaultLocale = await defaultLocale;
	}
}

const _createTranslations = await createTranslationsProxy(async () => {
	return "";
});

const t = createTranslations("e");
