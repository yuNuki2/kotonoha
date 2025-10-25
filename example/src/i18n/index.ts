
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export interface PluralParams {
	count: number;
	included?: boolean | undefined;
	type?: "cardinal" | "ordinal" | undefined;
}
  
export interface Result {
  "1": {
    "name": string
  },
  "2": {
    "name": string
  },
  "3": {
    "name": string
  },
  "4": {
    "name": string
  },
  "5": {
    "name": string
  },
  "home": {
    "home2": {
      "label": string,
      "value": string
    }
  },
  "signin": {
    "email": {
      "labe": {
        "name": string
      },
      "label": {
        "name": string
      }
    }
  },
  "a": {
    "name": ($name:string) => string
  },
  "b": {
    "name": number
  },
  "c": {
    "name": (params: {$email:string,$subject:string}) => string
  },
  "d": {
    "name": (params: PluralParams) => string,
    "name2": string
  },
  "e": {
    "name": (params: PluralParams) => string
  },
  "f-f-f-f": {
    "name": string
  },
  "g": {
    "name": string
  },
  "h": {
    "name": string
  },
  "i": {
    "name": string
  },
  "j": {
    "name": string
  },
  "k": {
    "name": string
  },
  "l": {
    "name": string
  },
  "m": {
    "name": string
  },
  "n": {
    "name": string
  },
  "o": {
    "name": string
  },
  "p": {
    "name": string
  },
  "q": {
    "name": string
  },
  "r": {
    "name": string
  },
  "s": {
    "name": string
  },
  "t": {
    "name": string
  },
  "u": {
    "name": string
  },
  "v": {
    "name": string
  },
  "w": {
    "name": string
  },
  "x": {
    "name": string
  },
  "y": {
    "name": string
  },
  "z": {
    "name": string
  }
}