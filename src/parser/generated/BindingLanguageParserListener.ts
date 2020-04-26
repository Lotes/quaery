// Generated from src/parser/BindingLanguageParser.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `BindingLanguageParser`.
 */
export interface BindingLanguageParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `idExpression`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterIdExpression?: (ctx: IdExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `idExpression`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitIdExpression?: (ctx: IdExpressionContext) => void;

	/**
	 * Enter a parse tree produced by the `numberLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNumberLiteral?: (ctx: NumberLiteralContext) => void;
	/**
	 * Exit a parse tree produced by the `numberLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNumberLiteral?: (ctx: NumberLiteralContext) => void;

	/**
	 * Enter a parse tree produced by the `stringLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterStringLiteral?: (ctx: StringLiteralContext) => void;
	/**
	 * Exit a parse tree produced by the `stringLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitStringLiteral?: (ctx: StringLiteralContext) => void;

	/**
	 * Enter a parse tree produced by the `trueLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterTrueLiteral?: (ctx: TrueLiteralContext) => void;
	/**
	 * Exit a parse tree produced by the `trueLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitTrueLiteral?: (ctx: TrueLiteralContext) => void;

	/**
	 * Enter a parse tree produced by the `falseLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterFalseLiteral?: (ctx: FalseLiteralContext) => void;
	/**
	 * Exit a parse tree produced by the `falseLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitFalseLiteral?: (ctx: FalseLiteralContext) => void;

	/**
	 * Enter a parse tree produced by the `nullLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNullLiteral?: (ctx: NullLiteralContext) => void;
	/**
	 * Exit a parse tree produced by the `nullLiteral`
	 * labeled alternative in `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNullLiteral?: (ctx: NullLiteralContext) => void;

	/**
	 * Enter a parse tree produced by the `textChunk`
	 * labeled alternative in `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 */
	enterTextChunk?: (ctx: TextChunkContext) => void;
	/**
	 * Exit a parse tree produced by the `textChunk`
	 * labeled alternative in `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 */
	exitTextChunk?: (ctx: TextChunkContext) => void;

	/**
	 * Enter a parse tree produced by the `bindingChunk`
	 * labeled alternative in `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 */
	enterBindingChunk?: (ctx: BindingChunkContext) => void;
	/**
	 * Exit a parse tree produced by the `bindingChunk`
	 * labeled alternative in `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 */
	exitBindingChunk?: (ctx: BindingChunkContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.chunks`.
	 * @param ctx the parse tree
	 */
	enterChunks?: (ctx: ChunksContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.chunks`.
	 * @param ctx the parse tree
	 */
	exitChunks?: (ctx: ChunksContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 */
	enterChunk?: (ctx: ChunkContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.chunk`.
	 * @param ctx the parse tree
	 */
	exitChunk?: (ctx: ChunkContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.binding`.
	 * @param ctx the parse tree
	 */
	enterBinding?: (ctx: BindingContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.binding`.
	 * @param ctx the parse tree
	 */
	exitBinding?: (ctx: BindingContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.bindingExpression`.
	 * @param ctx the parse tree
	 */
	enterBindingExpression?: (ctx: BindingExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.bindingExpression`.
	 * @param ctx the parse tree
	 */
	exitBindingExpression?: (ctx: BindingExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.tail`.
	 * @param ctx the parse tree
	 */
	enterTail?: (ctx: TailContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.tail`.
	 * @param ctx the parse tree
	 */
	exitTail?: (ctx: TailContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.property`.
	 * @param ctx the parse tree
	 */
	enterProperty?: (ctx: PropertyContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.property`.
	 * @param ctx the parse tree
	 */
	exitProperty?: (ctx: PropertyContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.parameters`.
	 * @param ctx the parse tree
	 */
	enterParameters?: (ctx: ParametersContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.parameters`.
	 * @param ctx the parse tree
	 */
	exitParameters?: (ctx: ParametersContext) => void;

	/**
	 * Enter a parse tree produced by `BindingLanguageParser.parameter`.
	 * @param ctx the parse tree
	 */
	enterParameter?: (ctx: ParameterContext) => void;
	/**
	 * Exit a parse tree produced by `BindingLanguageParser.parameter`.
	 * @param ctx the parse tree
	 */
	exitParameter?: (ctx: ParameterContext) => void;
}

