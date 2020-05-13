import { BindingLanguageParserVisitor } from "../parser/generated/BindingLanguageParserVisitor";
import { ExtendedChunk } from "../ast/SyntaxTree";
import { TextChunkContext, BindingChunkContext, ChunksContext } from "../parser/generated/BindingLanguageParser";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { LocatableExpressionVisitor } from "./BindingExpressionVisitor";
import { newTextChunk, newBindingChunk } from "../ast/factory";
import { LocatableExtension } from "../ast/TokenExtensions";
import { NodeKind } from "../ast/NodeKind";

export class ChunkSequenceVisitor extends AbstractParseTreeVisitor<ExtendedChunk<LocatableExtension>[]> implements BindingLanguageParserVisitor<ExtendedChunk<LocatableExtension>[]> {
  private bindingExpressionVisitor = new LocatableExpressionVisitor();
  protected defaultResult(): ExtendedChunk<LocatableExtension>[] {
    return [];
  }
  visitChunks = (ctx: ChunksContext) => ctx.chunk().map(c => this.visit(c)).reduce((lhs, rhs) => lhs.concat(rhs), []);
  visitTextChunk = (ctx: TextChunkContext) => [newTextChunk(ctx.text, {
    kind: NodeKind.TextChunk,
    tokenStart: ctx._start,
    tokenStop: ctx._stop ?? ctx._start
  })];
  visitBindingChunk = (ctx: BindingChunkContext) => [newBindingChunk(this.bindingExpressionVisitor.visit(ctx.binding()), {
    kind: NodeKind.BindingChunk,
    tokenLeftMustache: ctx.binding()._lmustache,
    tokenRightMustache: ctx.binding()._rmustache,
    tokenStart: ctx._start,
    tokenStop: ctx._stop ?? ctx._start
  })];
}