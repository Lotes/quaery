// Generated from src/parser/BindingLanguageParser.g4 by ANTLR 4.7.3-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { BindingLanguageParserListener } from "./BindingLanguageParserListener";
import { BindingLanguageParserVisitor } from "./BindingLanguageParserVisitor";


export class BindingLanguageParser extends Parser {
	public static readonly LMUSTACHE = 1;
	public static readonly TEXT = 2;
	public static readonly TRUE = 3;
	public static readonly FALSE = 4;
	public static readonly NULL = 5;
	public static readonly STRING = 6;
	public static readonly RMUSTACHE = 7;
	public static readonly LPAREN = 8;
	public static readonly RPAREN = 9;
	public static readonly DOT = 10;
	public static readonly UNIT = 11;
	public static readonly PX = 12;
	public static readonly PT = 13;
	public static readonly CM = 14;
	public static readonly MM = 15;
	public static readonly INCH = 16;
	public static readonly ID = 17;
	public static readonly NUMBER = 18;
	public static readonly DIGIT = 19;
	public static readonly COMMA = 20;
	public static readonly WS = 21;
	public static readonly RULE_chunks = 0;
	public static readonly RULE_chunk = 1;
	public static readonly RULE_binding = 2;
	public static readonly RULE_bindingExpression = 3;
	public static readonly RULE_expression = 4;
	public static readonly RULE_tail = 5;
	public static readonly RULE_property = 6;
	public static readonly RULE_functionCall = 7;
	public static readonly RULE_parameters = 8;
	public static readonly RULE_parameter = 9;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"chunks", "chunk", "binding", "bindingExpression", "expression", "tail", 
		"property", "functionCall", "parameters", "parameter",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'{{'", undefined, "'true'", "'false'", "'null'", undefined, 
		"'}}'", "'('", "')'", "'.'", undefined, "'px'", "'pt'", "'cm'", "'mm'", 
		"'inch'", undefined, undefined, undefined, "','",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "LMUSTACHE", "TEXT", "TRUE", "FALSE", "NULL", "STRING", "RMUSTACHE", 
		"LPAREN", "RPAREN", "DOT", "UNIT", "PX", "PT", "CM", "MM", "INCH", "ID", 
		"NUMBER", "DIGIT", "COMMA", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(BindingLanguageParser._LITERAL_NAMES, BindingLanguageParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return BindingLanguageParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "BindingLanguageParser.g4"; }

	// @Override
	public get ruleNames(): string[] { return BindingLanguageParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return BindingLanguageParser._serializedATN; }

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(BindingLanguageParser._ATN, this);
	}
	// @RuleVersion(0)
	public chunks(): ChunksContext {
		let _localctx: ChunksContext = new ChunksContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, BindingLanguageParser.RULE_chunks);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 23;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === BindingLanguageParser.LMUSTACHE || _la === BindingLanguageParser.TEXT) {
				{
				{
				this.state = 20;
				this.chunk();
				}
				}
				this.state = 25;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 26;
			this.match(BindingLanguageParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public chunk(): ChunkContext {
		let _localctx: ChunkContext = new ChunkContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, BindingLanguageParser.RULE_chunk);
		try {
			this.state = 30;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case BindingLanguageParser.TEXT:
				_localctx = new TextChunkContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 28;
				this.match(BindingLanguageParser.TEXT);
				}
				break;
			case BindingLanguageParser.LMUSTACHE:
				_localctx = new BindingChunkContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 29;
				this.binding();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public binding(): BindingContext {
		let _localctx: BindingContext = new BindingContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, BindingLanguageParser.RULE_binding);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 32;
			this.match(BindingLanguageParser.LMUSTACHE);
			this.state = 33;
			this.bindingExpression();
			this.state = 34;
			this.match(BindingLanguageParser.RMUSTACHE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public bindingExpression(): BindingExpressionContext {
		let _localctx: BindingExpressionContext = new BindingExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, BindingLanguageParser.RULE_bindingExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 36;
			this.expression();
			this.state = 38;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === BindingLanguageParser.UNIT) {
				{
				this.state = 37;
				this.match(BindingLanguageParser.UNIT);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, BindingLanguageParser.RULE_expression);
		let _la: number;
		try {
			this.state = 49;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case BindingLanguageParser.ID:
				_localctx = new IdExpressionContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 40;
				(_localctx as IdExpressionContext)._name = this.match(BindingLanguageParser.ID);
				this.state = 42;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === BindingLanguageParser.LPAREN || _la === BindingLanguageParser.DOT) {
					{
					this.state = 41;
					this.tail();
					}
				}

				}
				break;
			case BindingLanguageParser.NUMBER:
				_localctx = new NumberLiteralContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 44;
				(_localctx as NumberLiteralContext)._value = this.match(BindingLanguageParser.NUMBER);
				}
				break;
			case BindingLanguageParser.STRING:
				_localctx = new StringLiteralContext(_localctx);
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 45;
				(_localctx as StringLiteralContext)._value = this.match(BindingLanguageParser.STRING);
				}
				break;
			case BindingLanguageParser.TRUE:
				_localctx = new TrueLiteralContext(_localctx);
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 46;
				this.match(BindingLanguageParser.TRUE);
				}
				break;
			case BindingLanguageParser.FALSE:
				_localctx = new FalseLiteralContext(_localctx);
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 47;
				this.match(BindingLanguageParser.FALSE);
				}
				break;
			case BindingLanguageParser.NULL:
				_localctx = new NullLiteralContext(_localctx);
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 48;
				this.match(BindingLanguageParser.NULL);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public tail(): TailContext {
		let _localctx: TailContext = new TailContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, BindingLanguageParser.RULE_tail);
		try {
			this.state = 53;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case BindingLanguageParser.DOT:
				_localctx = new PropertyTailContext(_localctx);
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 51;
				this.property();
				}
				break;
			case BindingLanguageParser.LPAREN:
				_localctx = new FunctionCallTailContext(_localctx);
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 52;
				this.functionCall();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public property(): PropertyContext {
		let _localctx: PropertyContext = new PropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, BindingLanguageParser.RULE_property);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 55;
			this.match(BindingLanguageParser.DOT);
			this.state = 56;
			_localctx._name = this.match(BindingLanguageParser.ID);
			this.state = 58;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === BindingLanguageParser.LPAREN || _la === BindingLanguageParser.DOT) {
				{
				this.state = 57;
				_localctx._next = this.tail();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let _localctx: FunctionCallContext = new FunctionCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, BindingLanguageParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 60;
			this.match(BindingLanguageParser.LPAREN);
			this.state = 62;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << BindingLanguageParser.TRUE) | (1 << BindingLanguageParser.FALSE) | (1 << BindingLanguageParser.NULL) | (1 << BindingLanguageParser.STRING) | (1 << BindingLanguageParser.ID) | (1 << BindingLanguageParser.NUMBER))) !== 0)) {
				{
				this.state = 61;
				_localctx._list = this.parameters();
				}
			}

			this.state = 64;
			this.match(BindingLanguageParser.RPAREN);
			this.state = 66;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === BindingLanguageParser.LPAREN || _la === BindingLanguageParser.DOT) {
				{
				this.state = 65;
				_localctx._next = this.tail();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameters(): ParametersContext {
		let _localctx: ParametersContext = new ParametersContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, BindingLanguageParser.RULE_parameters);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 68;
			this.parameter();
			this.state = 71;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === BindingLanguageParser.COMMA) {
				{
				this.state = 69;
				this.match(BindingLanguageParser.COMMA);
				this.state = 70;
				this.parameters();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameter(): ParameterContext {
		let _localctx: ParameterContext = new ParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, BindingLanguageParser.RULE_parameter);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 73;
			this.bindingExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x17N\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x03\x02\x07\x02\x18\n\x02" +
		"\f\x02\x0E\x02\x1B\v\x02\x03\x02\x03\x02\x03\x03\x03\x03\x05\x03!\n\x03" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x05\x05)\n\x05\x03\x06" +
		"\x03\x06\x05\x06-\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06" +
		"4\n\x06\x03\x07\x03\x07\x05\x078\n\x07\x03\b\x03\b\x03\b\x05\b=\n\b\x03" +
		"\t\x03\t\x05\tA\n\t\x03\t\x03\t\x05\tE\n\t\x03\n\x03\n\x03\n\x05\nJ\n" +
		"\n\x03\v\x03\v\x03\v\x02\x02\x02\f\x02\x02\x04\x02\x06\x02\b\x02\n\x02" +
		"\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x02\x02\x02Q\x02\x19\x03\x02\x02" +
		"\x02\x04 \x03\x02\x02\x02\x06\"\x03\x02\x02\x02\b&\x03\x02\x02\x02\n3" +
		"\x03\x02\x02\x02\f7\x03\x02\x02\x02\x0E9\x03\x02\x02\x02\x10>\x03\x02" +
		"\x02\x02\x12F\x03\x02\x02\x02\x14K\x03\x02\x02\x02\x16\x18\x05\x04\x03" +
		"\x02\x17\x16\x03\x02\x02\x02\x18\x1B\x03\x02\x02\x02\x19\x17\x03\x02\x02" +
		"\x02\x19\x1A\x03\x02\x02\x02\x1A\x1C\x03\x02\x02\x02\x1B\x19\x03\x02\x02" +
		"\x02\x1C\x1D\x07\x02\x02\x03\x1D\x03\x03\x02\x02\x02\x1E!\x07\x04\x02" +
		"\x02\x1F!\x05\x06\x04\x02 \x1E\x03\x02\x02\x02 \x1F\x03\x02\x02\x02!\x05" +
		"\x03\x02\x02\x02\"#\x07\x03\x02\x02#$\x05\b\x05\x02$%\x07\t\x02\x02%\x07" +
		"\x03\x02\x02\x02&(\x05\n\x06\x02\')\x07\r\x02\x02(\'\x03\x02\x02\x02(" +
		")\x03\x02\x02\x02)\t\x03\x02\x02\x02*,\x07\x13\x02\x02+-\x05\f\x07\x02" +
		",+\x03\x02\x02\x02,-\x03\x02\x02\x02-4\x03\x02\x02\x02.4\x07\x14\x02\x02" +
		"/4\x07\b\x02\x0204\x07\x05\x02\x0214\x07\x06\x02\x0224\x07\x07\x02\x02" +
		"3*\x03\x02\x02\x023.\x03\x02\x02\x023/\x03\x02\x02\x0230\x03\x02\x02\x02" +
		"31\x03\x02\x02\x0232\x03\x02\x02\x024\v\x03\x02\x02\x0258\x05\x0E\b\x02" +
		"68\x05\x10\t\x0275\x03\x02\x02\x0276\x03\x02\x02\x028\r\x03\x02\x02\x02" +
		"9:\x07\f\x02\x02:<\x07\x13\x02\x02;=\x05\f\x07\x02<;\x03\x02\x02\x02<" +
		"=\x03\x02\x02\x02=\x0F\x03\x02\x02\x02>@\x07\n\x02\x02?A\x05\x12\n\x02" +
		"@?\x03\x02\x02\x02@A\x03\x02\x02\x02AB\x03\x02\x02\x02BD\x07\v\x02\x02" +
		"CE\x05\f\x07\x02DC\x03\x02\x02\x02DE\x03\x02\x02\x02E\x11\x03\x02\x02" +
		"\x02FI\x05\x14\v\x02GH\x07\x16\x02\x02HJ\x05\x12\n\x02IG\x03\x02\x02\x02" +
		"IJ\x03\x02\x02\x02J\x13\x03\x02\x02\x02KL\x05\b\x05\x02L\x15\x03\x02\x02" +
		"\x02\f\x19 (,37<@DI";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!BindingLanguageParser.__ATN) {
			BindingLanguageParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(BindingLanguageParser._serializedATN));
		}

		return BindingLanguageParser.__ATN;
	}

}

export class ChunksContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(BindingLanguageParser.EOF, 0); }
	public chunk(): ChunkContext[];
	public chunk(i: number): ChunkContext;
	public chunk(i?: number): ChunkContext | ChunkContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ChunkContext);
		} else {
			return this.getRuleContext(i, ChunkContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_chunks; }
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterChunks) {
			listener.enterChunks(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitChunks) {
			listener.exitChunks(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitChunks) {
			return visitor.visitChunks(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ChunkContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_chunk; }
	public copyFrom(ctx: ChunkContext): void {
		super.copyFrom(ctx);
	}
}
export class TextChunkContext extends ChunkContext {
	public TEXT(): TerminalNode { return this.getToken(BindingLanguageParser.TEXT, 0); }
	constructor(ctx: ChunkContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterTextChunk) {
			listener.enterTextChunk(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitTextChunk) {
			listener.exitTextChunk(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitTextChunk) {
			return visitor.visitTextChunk(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BindingChunkContext extends ChunkContext {
	public binding(): BindingContext {
		return this.getRuleContext(0, BindingContext);
	}
	constructor(ctx: ChunkContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterBindingChunk) {
			listener.enterBindingChunk(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitBindingChunk) {
			listener.exitBindingChunk(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitBindingChunk) {
			return visitor.visitBindingChunk(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BindingContext extends ParserRuleContext {
	public LMUSTACHE(): TerminalNode { return this.getToken(BindingLanguageParser.LMUSTACHE, 0); }
	public bindingExpression(): BindingExpressionContext {
		return this.getRuleContext(0, BindingExpressionContext);
	}
	public RMUSTACHE(): TerminalNode { return this.getToken(BindingLanguageParser.RMUSTACHE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_binding; }
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterBinding) {
			listener.enterBinding(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitBinding) {
			listener.exitBinding(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitBinding) {
			return visitor.visitBinding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BindingExpressionContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public UNIT(): TerminalNode | undefined { return this.tryGetToken(BindingLanguageParser.UNIT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_bindingExpression; }
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterBindingExpression) {
			listener.enterBindingExpression(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitBindingExpression) {
			listener.exitBindingExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitBindingExpression) {
			return visitor.visitBindingExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_expression; }
	public copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class IdExpressionContext extends ExpressionContext {
	public _name: Token;
	public ID(): TerminalNode { return this.getToken(BindingLanguageParser.ID, 0); }
	public tail(): TailContext | undefined {
		return this.tryGetRuleContext(0, TailContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterIdExpression) {
			listener.enterIdExpression(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitIdExpression) {
			listener.exitIdExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitIdExpression) {
			return visitor.visitIdExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NumberLiteralContext extends ExpressionContext {
	public _value: Token;
	public NUMBER(): TerminalNode { return this.getToken(BindingLanguageParser.NUMBER, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterNumberLiteral) {
			listener.enterNumberLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitNumberLiteral) {
			listener.exitNumberLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitNumberLiteral) {
			return visitor.visitNumberLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class StringLiteralContext extends ExpressionContext {
	public _value: Token;
	public STRING(): TerminalNode { return this.getToken(BindingLanguageParser.STRING, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterStringLiteral) {
			listener.enterStringLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitStringLiteral) {
			listener.exitStringLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitStringLiteral) {
			return visitor.visitStringLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TrueLiteralContext extends ExpressionContext {
	public TRUE(): TerminalNode { return this.getToken(BindingLanguageParser.TRUE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterTrueLiteral) {
			listener.enterTrueLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitTrueLiteral) {
			listener.exitTrueLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitTrueLiteral) {
			return visitor.visitTrueLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FalseLiteralContext extends ExpressionContext {
	public FALSE(): TerminalNode { return this.getToken(BindingLanguageParser.FALSE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterFalseLiteral) {
			listener.enterFalseLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitFalseLiteral) {
			listener.exitFalseLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitFalseLiteral) {
			return visitor.visitFalseLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NullLiteralContext extends ExpressionContext {
	public NULL(): TerminalNode { return this.getToken(BindingLanguageParser.NULL, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterNullLiteral) {
			listener.enterNullLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitNullLiteral) {
			listener.exitNullLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitNullLiteral) {
			return visitor.visitNullLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TailContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_tail; }
	public copyFrom(ctx: TailContext): void {
		super.copyFrom(ctx);
	}
}
export class PropertyTailContext extends TailContext {
	public property(): PropertyContext {
		return this.getRuleContext(0, PropertyContext);
	}
	constructor(ctx: TailContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterPropertyTail) {
			listener.enterPropertyTail(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitPropertyTail) {
			listener.exitPropertyTail(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitPropertyTail) {
			return visitor.visitPropertyTail(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FunctionCallTailContext extends TailContext {
	public functionCall(): FunctionCallContext {
		return this.getRuleContext(0, FunctionCallContext);
	}
	constructor(ctx: TailContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterFunctionCallTail) {
			listener.enterFunctionCallTail(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitFunctionCallTail) {
			listener.exitFunctionCallTail(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitFunctionCallTail) {
			return visitor.visitFunctionCallTail(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyContext extends ParserRuleContext {
	public _name: Token;
	public _next: TailContext;
	public DOT(): TerminalNode { return this.getToken(BindingLanguageParser.DOT, 0); }
	public ID(): TerminalNode { return this.getToken(BindingLanguageParser.ID, 0); }
	public tail(): TailContext | undefined {
		return this.tryGetRuleContext(0, TailContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_property; }
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterProperty) {
			listener.enterProperty(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitProperty) {
			listener.exitProperty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitProperty) {
			return visitor.visitProperty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionCallContext extends ParserRuleContext {
	public _list: ParametersContext;
	public _next: TailContext;
	public LPAREN(): TerminalNode { return this.getToken(BindingLanguageParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(BindingLanguageParser.RPAREN, 0); }
	public parameters(): ParametersContext | undefined {
		return this.tryGetRuleContext(0, ParametersContext);
	}
	public tail(): TailContext | undefined {
		return this.tryGetRuleContext(0, TailContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_functionCall; }
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterFunctionCall) {
			listener.enterFunctionCall(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitFunctionCall) {
			listener.exitFunctionCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParametersContext extends ParserRuleContext {
	public parameter(): ParameterContext {
		return this.getRuleContext(0, ParameterContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(BindingLanguageParser.COMMA, 0); }
	public parameters(): ParametersContext | undefined {
		return this.tryGetRuleContext(0, ParametersContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_parameters; }
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterParameters) {
			listener.enterParameters(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitParameters) {
			listener.exitParameters(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitParameters) {
			return visitor.visitParameters(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	public bindingExpression(): BindingExpressionContext {
		return this.getRuleContext(0, BindingExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return BindingLanguageParser.RULE_parameter; }
	// @Override
	public enterRule(listener: BindingLanguageParserListener): void {
		if (listener.enterParameter) {
			listener.enterParameter(this);
		}
	}
	// @Override
	public exitRule(listener: BindingLanguageParserListener): void {
		if (listener.exitParameter) {
			listener.exitParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: BindingLanguageParserVisitor<Result>): Result {
		if (visitor.visitParameter) {
			return visitor.visitParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


