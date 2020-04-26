parser grammar BindingLanguageParser;

options {
	tokenVocab = BindingLanguageLexer;
}

chunks: chunk* EOF;

chunk: TEXT # textChunk | binding # bindingChunk;

binding: LMUSTACHE bindingExpression RMUSTACHE;

bindingExpression: value = expression unit = UNIT?;

expression:
	name = ID next = tail?	# idExpression
	| value = NUMBER		# numberLiteral
	| value = STRING		# stringLiteral
	| TRUE					# trueLiteral
	| FALSE					# falseLiteral
	| NULL					# nullLiteral;

tail: property | functionCall;

property: DOT name = ID next = tail?;

functionCall: LPAREN list = parameters? RPAREN next = tail?;

parameters: lhs = parameter (COMMA rhs = parameters)?;

parameter: bindingExpression;