import { compile as originalCompile } from "./parse";
import { Unit, Chunk, BindingExpression, ChunkKind } from "../ast/SyntaxTree";
import { newString, newTextChunk, newBindingChunk, newIdentifier, newNumber, newNull, newBoolean, newUnitAnnotation, newPropertyAccess, newFunctionCall } from "../ast/factory";
import { isObject, isArray } from "util";

function hideLocations(expression: any): BindingExpression {
  const result: any = { ...expression };
  for (let key of Object.keys(result)) {
    if (key.includes("token")) {
      delete result[key];
    } else if (isObject(result[key]) && result[key].kind != null) {
      result[key] = hideLocations(result[key]);
    } else if (isArray(result[key])) {
      result[key] = result[key].map((item: any) => hideLocations(item));
    }
  }
  return result as unknown as BindingExpression;
}

function compile(text: string): Chunk<{}>[] {
  return originalCompile(text).map(ch => {
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
    expect(compile("text")).toEqual([newTextChunk('text')]);
  });

  it("should parse text chunk with LBRACE at the end", () => {
    expect(compile("text{")).toEqual([newTextChunk('text{')]);
  });

  it("should parse ID binding", () => {
    expect(compile("{{Id}}")).toEqual([newBindingChunk(
      newIdentifier("Id", {})
    )]);
  });

  it("should not parse corrupted ID binding", () => {
    expect(() => compile("{{Id")).toThrowError("Missing");
  });

  it("should not parse extraeous characters", () => {
    expect(() => compile("{{Id&}}")).toThrowError("Extraneous input");
  });

  it("should not parse mismatched characters", () => {
    expect(() => compile("{{Id+Id}}")).toThrowError("Mismatched input");
  });

  it("should not parse corrupted unit binding", () => {
    expect(() => compile("{{px}}")).toThrowError("px");
  });

  it("should not parse corrupted number binding", () => {
    expect(() => compile("{{123,456}}")).toThrowError(",");
  });

  it("should parse NUMBER binding", () => {
    expect(compile("{{1234.5678}}")).toEqual([newBindingChunk(
      newNumber(1234.5678, {})
    )]);
  });

  it("should parse STRING binding", () => {
    expect(compile("{{\"string\"}}")).toEqual([newBindingChunk(
      newString("string", {})
    )]);
  });

  it("should parse TRUE binding", () => {
    expect(compile("{{true}}")).toEqual([newBindingChunk(
      newBoolean(true, {})
    )]);
  });

  it("should parse FALSE binding", () => {
    expect(compile("{{false}}")).toEqual([newBindingChunk(
      newBoolean(false, {})
    )]);
  });

  it("should parse NULL binding", () => {
    expect(compile("{{null}}")).toEqual([newBindingChunk(
      newNull({})
    )]);
  });

  it("should parse UNIT binding", () => {
    expect(compile("{{100px}}")).toEqual([newBindingChunk(
      newUnitAnnotation(newNumber(100, {}), Unit.Pixels, {})
    )]);
  });
  it("should parse property binding", () => {
    expect(compile("{{Image.Width}}")).toEqual([newBindingChunk(
      newPropertyAccess(newIdentifier("Image", {}), "Width", {})
    )]);
  });

  it("should parse function call binding", () => {
    expect(compile("{{Image.MoveTo(123, 456)}}")).toEqual([newBindingChunk(
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
    expect(compile("{{random()}}")).toEqual([newBindingChunk(
      newFunctionCall(
        newIdentifier("random", {}),
        []
        , {})
    )]);
  });
});