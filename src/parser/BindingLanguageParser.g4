parser grammar BindingLanguageParser;

options {
	tokenVocab = BindingLanguageLexer;
}

chunks: chunk* EOF;

chunk: TEXT # textChunk | binding # bindingChunk;

binding:
	lmustache = LMUSTACHE bindingExpression rmustache = RMUSTACHE;

bindingExpression: value = expression unit = UNIT?;

expression:
	name = ID next = tail?	# idExpression
	| value = NUMBER		# numberLiteral
	| value = STRING		# stringLiteral
	| value = TRUE			# trueLiteral
	| value = FALSE			# falseLiteral
	| value = NULL			# nullLiteral;

tail: property | functionCall;

property: dot = DOT name = ID next = tail?;

functionCall:
	lparen = LPAREN list = parameters? rparen = RPAREN next = tail?;

parameters: lhs = parameter (comma = COMMA rhs = parameters)?;

parameter: bindingExpression;