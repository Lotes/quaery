import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { ChunkKind, ChunkSequence } from "../ast/SyntaxTree";
import { TextChunkContext, BindingChunkContext, ChunksContext } from "../parser/generated/BindingLanguageParser";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { BindingExpressionVisitor } from "./BindingExpressionVisitor";

export class ChunkSequenceVisitor extends AbstractParseTreeVisitor<ChunkSequence> implements BindingLanguageParserVisitor<ChunkSequence> {
  private bindingExpressionVisitor = new BindingExpressionVisitor();
  protected defaultResult(): ChunkSequence {
    return [];
  }
  visitChunks = (ctx: ChunksContext) => ctx.chunk().map(c => this.visit(c)).reduce((lhs, rhs) => lhs.concat(rhs), []);
  visitTextChunk = (ctx: TextChunkContext) => [{
    kind: ChunkKind.Text,
    payload: ctx.text
  }];
  visitBindingChunk = (ctx: BindingChunkContext) => [{
    kind: ChunkKind.Binding,
    payload: this.bindingExpressionVisitor.visit(ctx.binding())
  }];
}