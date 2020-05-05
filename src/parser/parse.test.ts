import { parse as originalParse } from "./parse";
import { Unit, Chunk, BindingExpression, ChunkKind } from "../ast/SyntaxTree";
import { newString, newTextChunk, newBindingChunk, newIdentifier, newNumber, newNull, newBoolean, newUnitAnnotation, newPropertyAccess, newFunctionCall } from "../ast/factory";
import { isObject, isArray } from "util";

function hideLocations(expression: any): BindingExpression {
  const result: any = { ...expression };
  for (let key of Object.keys(result)) {
    if (key.includes("location")) {
      delete result[key];
    } else if (isObject(result[key]) && result[key].kind != null) {
      result[key] = hideLocations(result[key]);
    } else if (isArray(result[key])) {
      result[key] = result[key].map((item: any) => hideLocations(item));
    }
  }
  return result as unknown as BindingExpression;
}

function parse(text: string): Chunk<{}>[] {
  return originalParse(text).map(ch => {
    if (ch.kind === ChunkKind.Binding) {
      return {
        ...ch,
        binding: hideLocations(ch.binding)
      }
    }
    return ch;
  });
}

describe("parse", () => {
  it("should parse text chunk", () => {
    expect(parse("text")).toEqual([newTextChunk('text')]);
  });

  it("should parse text chunk with LBRACE at the end", () => {
    expect(parse("text{")).toEqual([newTextChunk('text{')]);
  });

  it("should parse ID binding", () => {
    expect(parse("{{Id}}")).toEqual([newBindingChunk(
      newIdentifier("Id", {})
    )]);
  });

  it("should not parse corrupted ID binding", () => {
    expect(() => parse("{{Id")).toThrowError("Missing");
  });

  it("should not parse extraeous characters", () => {
    expect(() => parse("{{Id&}}")).toThrowError("Extraneous input");
  });

  it("should not parse mismatched characters", () => {
    expect(() => parse("{{Id+Id}}")).toThrowError("Mismatched input");
  });

  it("should not parse corrupted unit binding", () => {
    expect(() => parse("{{px}}")).toThrowError("px");
  });

  it("should not parse corrupted number binding", () => {
    expect(() => parse("{{123,456}}")).toThrowError(",");
  });

  it("should parse NUMBER binding", () => {
    expect(parse("{{1234.5678}}")).toEqual([newBindingChunk(
      newNumber(1234.5678, {})
    )]);
  });

  it("should parse STRING binding", () => {
    expect(parse("{{\"string\"}}")).toEqual([newBindingChunk(
      newString("string", {})
    )]);
  });

  it("should parse TRUE binding", () => {
    expect(parse("{{true}}")).toEqual([newBindingChunk(
      newBoolean(true, {})
    )]);
  });

  it("should parse FALSE binding", () => {
    expect(parse("{{false}}")).toEqual([newBindingChunk(
      newBoolean(false, {})
    )]);
  });

  it("should parse NULL binding", () => {
    expect(parse("{{null}}")).toEqual([newBindingChunk(
      newNull({})
    )]);
  });

  it("should parse UNIT binding", () => {
    expect(parse("{{100px}}")).toEqual([newBindingChunk(
      newUnitAnnotation(newNumber(100, {}), Unit.Pixels, {})
    )]);
  });
  it("should parse property binding", () => {
    expect(parse("{{Image.Width}}")).toEqual([newBindingChunk(
      newPropertyAccess(newIdentifier("Image", {}), "Width", {})
    )]);
  });

  it("should parse function call binding", () => {
    expect(parse("{{Image.MoveTo(123, 456)}}")).toEqual([newBindingChunk(
      newFunctionCall(
        newPropertyAccess(newIdentifier("Image", {}), "MoveTo", {}),
        [
          newNumber(123, {}),
          newNumber(456, {})
        ]
        , {})
    )]);
  });

  it("should parse parameterless global function binding", () => {
    expect(parse("{{random()}}")).toEqual([newBindingChunk(
      newFunctionCall(
        newIdentifier("random", {}),
        []
        , {})
    )]);
  });
});