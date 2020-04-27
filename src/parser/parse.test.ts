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

  it("should not parse corrupted ID binding", () => {
    expect(() => parse("{{Id")).toThrowError();
  });

  it("should not parse corrupted unit binding", () => {
    expect(() => parse("{{px}}")).toThrowError();
  });

  it("should not parse corrupted number binding", () => {
    expect(() => parse("{{123,456}}")).toThrowError();
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
  it("should parse property binding", () => {
    expect(parse("{{Image.Width}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.PropertyAccess,
        payload: {
          propertyName: "Width",
          operand: {
            kind: BindingExpressionKind.Identifier,
            payload: "Image"
          }
        }
      }
    }]);
  });

  it("should parse function call binding", () => {
    expect(parse("{{Image.MoveTo(123, 456)}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.FunctionCall,
        payload: {
          parameters: [{
            kind: BindingExpressionKind.Number,
            payload: 123
          }, {
            kind: BindingExpressionKind.Number,
            payload: 456
          }],
          operand: {
            kind: BindingExpressionKind.PropertyAccess,
            payload: {
              propertyName: "MoveTo",
              operand: {
                kind: BindingExpressionKind.Identifier,
                payload: "Image"
              }
            }
          }
        }
      }
    }]);
  });

  it("should parse parameterless global function binding", () => {
    expect(parse("{{random()}}")).toEqual([{
      kind: ChunkKind.Binding,
      payload: {
        kind: BindingExpressionKind.FunctionCall,
        payload: {
          parameters: [],
          operand: {
            kind: BindingExpressionKind.Identifier,
            payload: "random"
          }
        }
      }
    }]);
  });
});