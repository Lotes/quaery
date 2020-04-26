// Generated from src/parser/BindingLanguageParser.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { IdExpressionContext } from "./BindingLanguageParser";
import { NumberLiteralContext } from "./BindingLanguageParser";
import { StringLiteralContext } from "./BindingLanguageParser";
import { TrueLiteralContext } from "./BindingLanguageParser";
import { FalseLiteralContext } from "./BindingLanguageParser";
import { NullLiteralContext } from "./BindingLanguageParser";
import { TextChunkContext } from "./BindingLanguageParser";
import { BindingChunkContext } from "./BindingLanguageParser";
import { ChunksContext } from "./BindingLanguageParser";
import { ChunkContext } from "./BindingLanguageParser";
import { BindingContext } from "./BindingLanguageParser";
import { BindingExpressionContext } from "./BindingLanguageParser";
import { ExpressionContext } from "./BindingLanguageParser";
import { TailContext } from "./BindingLanguageParser";
import { PropertyContext } from "./BindingLanguageParser";
import { FunctionCallContext } from "./BindingLanguageParser";
import { ParametersContext } from "./BindingLanguageParser";
import { ParameterContext } from "./BindingLanguageParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `BindingLanguageParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface BindingLanguageParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `idExpression`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdExpression?: (ctx: IdExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by the `numberLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumberLiteral?: (ctx: NumberLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by the `stringLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringLiteral?: (ctx: StringLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by the `trueLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTrueLiteral?: (ctx: TrueLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by the `falseLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFalseLiteral?: (ctx: FalseLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by the `nullLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNullLiteral?: (ctx: NullLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by the `textChunk`
	 * labeled alternative in `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTextChunk?: (ctx: TextChunkContext) => Result;

	/**
	 * Visit a parse tree produced by the `bindingChunk`
	 * labeled alternative in `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBindingChunk?: (ctx: BindingChunkContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.chunks`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitChunks?: (ctx: ChunksContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitChunk?: (ctx: ChunkContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.binding`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBinding?: (ctx: BindingContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.bindingExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBindingExpression?: (ctx: BindingExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.tail`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTail?: (ctx: TailContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.property`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProperty?: (ctx: PropertyContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.parameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameters?: (ctx: ParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `BindingLanguageParser.parameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameter?: (ctx: ParameterContext) => Result;
}

