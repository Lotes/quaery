lexer grammar BindingLanguageLexer;

LMUSTACHE: '{{' -> mode(WITHIN_BINDING_MODE);
TEXT: (~'{' | '{' (~'{' | EOF))+;

mode WITHIN_BINDING_MODE;
fragment PX: 'px';
fragment PT: 'pt';
fragment CM: 'cm';
fragment MM: 'mm';
fragment INCH: 'inch';
fragment DIGIT: [0-9];
UNIT: PX | PT | MM | CM | INCH;
TRUE: 'true';
FALSE: 'false';
NULL: 'null';
STRING: '"' (~'\\' | '\\"' | '\\\\')* '"';
RMUSTACHE: '}}' -> mode(DEFAULT_MODE);
LPAREN: '(';
RPAREN: ')';
DOT: '.';
ID: [A-Za-z_][A-Za-z0-9_]*;
NUMBER: DIGIT+ (DOT DIGIT+)?;
COMMA: ',';

WS: [ \t\r\n]+ -> skip;