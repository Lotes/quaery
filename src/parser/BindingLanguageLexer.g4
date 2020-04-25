lexer grammar BindingLanguageLexer;

LMUSTACHE: '{{' -> mode(WITHIN_BINDING_MODE);
TEXT: (~'{' | '{' ~'{')+;

mode WITHIN_BINDING_MODE;
TRUE: 'true';
FALSE: 'false';
NULL: 'null';
STRING: '"' ('\\' [\\"] | [^"\\]) '"';
RMUSTACHE: '}}' -> mode(DEFAULT_MODE);
LPAREN: '(';
RPAREN: ')';
DOT: '.';
UNIT: PX | PT | MM | CM | INCH;
PX: 'px';
PT: 'pt';
CM: 'cm';
MM: 'mm';
INCH: 'inch';
ID: [A-Z][A-Za-z0-9_]*;
NUMBER: DIGIT+ (DOT DIGIT+)?;
DIGIT: [0-9];
COMMA: ',';

WS: ' \t\r\n'+ -> skip;