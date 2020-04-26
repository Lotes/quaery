import { parse } from "./parse";
import { ChunkKind, BindingExpressionKind, Unit } from "../ast/SyntaxTree";

describe("parse", () => {
  it("should parse text chunk", () => {
    expect(parse("text")).toEqual([{
      kind: ChunkKind.Text,
      payload: 'text'
    }]);
  });

  it("should parse text chunk with LBRACE at the end", () => {
    expect(parse("text{")).toEqual([{
      kind: ChunkKind.Text,
      payload: 'text{'
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

  it("should parse TRUE binding", () => {
    expect(parse("{{true}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.Boolean,
        payload: true
      }
    }]);
  });

  it("should parse FALSE binding", () => {
    expect(parse("{{false}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.Boolean,
        payload: false
      }
    }]);
  });

  it("should parse NULL binding", () => {
    expect(parse("{{null}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.Null,
        payload: null
      }
    }]);
  });

  it("should parse UNIT binding", () => {
    expect(parse("{{100px}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.UnitAnnotation,
        payload: {
          unit: Unit.Pixels,
          operand: {
            kind: BindingExpressionKind.Number,
            payload: 100
          }
        }
      }
    }]);
  });
  // it("should parse property binding", () => {
  //   expect(parse("{{Image.Width}}")).toEqual([{
  //     kind: ChunkKind.Binding,
  //     payload: {
  //       kind: BindingExpressionKind.PropertyAccess,
  //       name: "Width",
  //       operand: {
  //         kind: BindingExpressionKind.Identifier,
  //         payload: "Image"
  //       }
  //     }
  //   }]);
  // });
});