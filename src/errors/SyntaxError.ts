import { Range } from "../ast/RangeExtensions";

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

export class SyntaxError extends Error {
  translationKey: TranslationKey;
  defaultMessageTemplate: string;
  parameters: TranslationParameters;
  location: Range;
  constructor(translationKey: TranslationKey, defaultMessageTemplate: string, parameters: TranslationParameters, location: Range) {
    super(format(defaultMessageTemplate, parameters));
    this.translationKey = translationKey;
    this.defaultMessageTemplate = defaultMessageTemplate;
    this.parameters = parameters;
    this.location = location;
  }
}