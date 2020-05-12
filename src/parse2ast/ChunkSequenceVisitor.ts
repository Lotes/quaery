import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { Chunk } from "../ast/SyntaxTree";
import { TextChunkContext, BindingChunkContext, ChunksContext } from "../parser/generated/BindingLanguageParser";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { LocatableExpressionVisitor } from "./BindingExpressionVisitor";
import { newTextChunk, newBindingChunk } from "../ast/factory";
import { LocatableExtension } from "../ast/TokenExtensions";

export class ChunkSequenceVisitor extends AbstractParseTreeVisitor<Chunk<LocatableExtension>[]> implements BindingLanguageParserVisitor<Chunk<LocatableExtension>[]> {
  private bindingExpressionVisitor = new LocatableExpressionVisitor();
  protected defaultResult(): Chunk<LocatableExtension>[] {
    return [];
  }
  visitChunks = (ctx: ChunksContext) => ctx.chunk().map(c => this.visit(c)).reduce((lhs, rhs) => lhs.concat(rhs), []);
  visitTextChunk = (ctx: TextChunkContext) => [newTextChunk(ctx.text)];
  visitBindingChunk = (ctx: BindingChunkContext) => [newBindingChunk(this.bindingExpressionVisitor.visit(ctx.binding()))];
}