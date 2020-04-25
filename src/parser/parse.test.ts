import { parse } from "./parse";
import { ChunkKind, BindingExpressionKind } from "../ast/SyntaxTree";

describe("parse", () => {
  it("should parse text chunk", () => {
    expect(parse("text")).toEqual([{
      kind: ChunkKind.Text,
      payload: 'text'
    }]);
  });

  it("should parse ID binding", () => {
    expect(parse("{{Id}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.Identifier,
        payload: "Id"
      }
    }]);
  });

  it("should parse NUMBER binding", () => {
    expect(parse("{{1234.5678}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.Number,
        payload: 1234.5678
      }
    }]);
  });

  it("should parse STRING binding", () => {
    expect(parse("{{\"string\"}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.String,
        payload: "string"
      }
    }]);
  });
});