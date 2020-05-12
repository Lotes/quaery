import { Token } from "antlr4ts";

export type TranslationKey = string;
export type TranslationParameterValue = string | number | boolean;

export interface TranslationParameters {
  [name: string]: TranslationParameterValue;
}

const patternParameter = /\$\{([a-z]+)\}/gi;
export function format(messageTemplate: string, parameters: TranslationParameters): string {
  let result = "";
  let firstNewCharIndex = 0;
  let match;
  while ((match = patternParameter.exec(messageTemplate)) != null) {
    if (match.index > firstNewCharIndex) {
      result += messageTemplate.substring(firstNewCharIndex, match.index);
    }
    const addedText = parameters[match[1]].toString();
    result += addedText;
    firstNewCharIndex = patternParameter.lastIndex;
  }
  result += messageTemplate.substring(firstNewCharIndex);
  return result;
}

export enum LocationKind {
  Token, Offset
}

export interface TokenLocation {
  kind: LocationKind.Token;
  start: Token;
  stop: Token;
}

export interface OffsetLocation {
  kind: LocationKind.Offset;
  start: number;
  stop: number;
}

export type Location = TokenLocation | OffsetLocation;

export class SyntaxError extends Error {
  translationKey: TranslationKey;
  defaultMessageTemplate: string;
  parameters: TranslationParameters;
  location: Location;
  constructor(translationKey: TranslationKey, defaultMessageTemplate: string, parameters: TranslationParameters, location: Location) {
    super(format(defaultMessageTemplate, parameters));
    this.translationKey = translationKey;
    this.defaultMessageTemplate = defaultMessageTemplate;
    this.parameters = parameters;
    this.location = location;
  }
}