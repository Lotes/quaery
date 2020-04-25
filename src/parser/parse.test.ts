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

});