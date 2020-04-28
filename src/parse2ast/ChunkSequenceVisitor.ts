import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { ChunkKind, GenericBindingExpression, Chunk } from "../ast/SyntaxTree";
import { TextChunkContext, BindingChunkContext, ChunksContext } from "../parser/generated/BindingLanguageParser";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { BindingExpressionVisitor } from "./BindingExpressionVisitor";
import { newTextChunk, newBindingChunk } from "../ast/SyntaxTreeBuilder";

export class ChunkSequenceVisitor<T extends GenericBindingExpression<T>> extends AbstractParseTreeVisitor<Chunk<T>[]> implements BindingLanguageParserVisitor<Chunk<T>[]> {
  private bindingExpressionVisitor = new BindingExpressionVisitor();
  protected defaultResult(): Chunk<T>[] {
    return [];
  }
  visitChunks = (ctx: ChunksContext) => ctx.chunk().map(c => this.visit(c)).reduce((lhs, rhs) => lhs.concat(rhs), []);
  visitTextChunk = (ctx: TextChunkContext) => [newTextChunk(ctx.text)];
  visitBindingChunk = (ctx: BindingChunkContext) => [newBindingChunk(this.bindingExpressionVisitor.visit(ctx.binding()))];
}