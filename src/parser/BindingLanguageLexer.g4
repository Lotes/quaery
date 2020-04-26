lexer grammar BindingLanguageLexer;

LMUSTACHE: '{{' -> mode(WITHIN_BINDING_MODE);
TEXT: (~'{' | '{' (~'{' | EOF))+;

mode WITHIN_BINDING_MODE;
fragment PX: 'px';
fragment PT: 'pt';
fragment CM: 'cm';
fragment MM: 'mm';
UNIT: PX | PT | MM | CM | INCH;
TRUE: 'true';
FALSE: 'false';
NULL: 'null';
STRING: '"' (~'\\' | '\\"' | '\\\\')* '"';
RMUSTACHE: '}}' -> mode(DEFAULT_MODE);
LPAREN: '(';
RPAREN: ')';
DOT: '.';
INCH: 'inch';
ID: [A-Z][A-Za-z0-9_]*;
NUMBER: DIGIT+ (DOT DIGIT+)?;
DIGIT: [0-9];
COMMA: ',';

WS: ' \t\r\n'+ -> skip;