import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { Chunk } from "../ast/SyntaxTree";
import { TextChunkContext, BindingChunkContext, ChunksContext } from "../parser/generated/BindingLanguageParser";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { BindingExpressionVisitor } from "./BindingExpressionVisitor";
import { newTextChunk, newBindingChunk } from "../ast/factory";

export class ChunkSequenceVisitor extends AbstractParseTreeVisitor<Chunk<{}>[]> implements BindingLanguageParserVisitor<Chunk<{}>[]> {
  private bindingExpressionVisitor = new BindingExpressionVisitor();
  protected defaultResult(): Chunk<{}>[] {
    return [];
  }
  visitChunks = (ctx: ChunksContext) => ctx.chunk().map(c => this.visit(c)).reduce((lhs, rhs) => lhs.concat(rhs), []);
  visitTextChunk = (ctx: TextChunkContext) => [newTextChunk(ctx.text, {})];
  visitBindingChunk = (ctx: BindingChunkContext) => [newBindingChunk(this.bindingExpressionVisitor.visit(ctx.binding()), {})];
}