import { BindingExpression, Chunk, UnitAnnotationPayload, PropertyExpressionPayload, FunctionCallExpressionPayload, GenericBindingExpression, ChunkKind, BindingExpressionKind, Unit } from "../ast/SyntaxTree";
import { Type, TypeSystem, Primitives, CoercionRule, TypeKind, ComplexTypeScope } from "../typesystem/TypeSystem";
import { createFold, AbstractSyntaxTreeFolder } from "../ast/fold";

export interface TypedBindingExpression extends GenericBindingExpression<TypedBindingExpression> {
  resolved: boolean;
  semantics: Type | Error | null;
  operation?: CoercionRule;
}

type BindingExpressionPromiseThenCallback = (binding: TypedBindingExpression) => TypedBindingExpression;

class CoercionFolder extends AbstractSyntaxTreeFolder<TypeSystem, BindingExpression, TypedBindingExpression> {
  visitChunk_Binding(binding: TypedBindingExpression, arg: TypeSystem): Chunk<TypedBindingExpression> {
    return {
      kind: ChunkKind.Binding,
      payload: this.coerceIfNeeded(binding, arg, Primitives.String)
    };
  }

  private coerceIfNeeded(binding: TypedBindingExpression, arg: TypeSystem, targetType: Type): TypedBindingExpression {
    return this.promiseThen(binding, bnd => {
      if (bnd.semantics === targetType) {
        return bnd;
      } else {
        const castOperation = arg.getCoercionRule(bnd.semantics as Type, targetType);
        if (castOperation != null) {
          return {
            kind: BindingExpressionKind.FunctionCall,
            payload: {
              operand: bnd,
              parameters: []
            },
            resolved: true,
            semantics: targetType,
            operation: castOperation
          };
        } else {
          return {
            ...bnd,
            resolved: false,
            semantics: new Error("Cannot cast!") //TODO cannot cast from binding.semantics as Type to targetType
          }
        }
      }
    });
  }

  private promiseThen(binding: TypedBindingExpression, callback: BindingExpressionPromiseThenCallback): TypedBindingExpression {
    if (binding.resolved) {
      return callback(binding);
    } else {
      return {
        kind: binding.kind,
        payload: binding.payload,
        resolved: false,
        semantics: binding.semantics
      };
    }
  }

  visitBinding_UnitAnnotation(annotation: UnitAnnotationPayload<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
    let targetType: Type = {
      kind: TypeKind.Measurable,
      description: annotation.unit
    };
    return this.coerceIfNeeded(annotation.operand, arg, targetType);
  }
  visitBinding_Property(property: PropertyExpressionPayload<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
    const operand = property.operand;
    return this.promiseThen(operand, binding => {
      const template = {
        kind: BindingExpressionKind.PropertyAccess,
        payload: {
          name: property.name,
          operand: binding
        },
        resolved: false,
        semantics: null
      };
      function error(message: string) {
        return {
          ...template,
          resolved: false,
          semantics: new Error(message)
        }
      }

      const sourceType = binding.semantics as Type;
      if (sourceType.kind === TypeKind.Complex) {
        const scope = sourceType.description as ComplexTypeScope;
        const propertyDefinition = scope.lookup(property.name);
        if (propertyDefinition != null) {
          return {
            ...template,
            resolved: true,
            semantics: propertyDefinition.type
          };
        } else {
          return error("Property does not exist.");
        }
      } else {
        return error("Operand is not a complex type.");
      }
    });
  }
  visitBinding_FunctionCall(functionCall: FunctionCallExpressionPayload<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
    throw new Error("Method not implemented.");
  }
  visitBinding_StringLiteral(value: string, arg: TypeSystem): TypedBindingExpression {
    return {
      kind: BindingExpressionKind.String,
      payload: value,
      resolved: true,
      semantics: Primitives.String,
    };
  }
  visitBinding_NumberLiteral(value: number, arg: TypeSystem): TypedBindingExpression {
    return {
      kind: BindingExpressionKind.Number,
      payload: value,
      resolved: true,
      semantics: Primitives.Number,
    };
  }
  visitBinding_BooleanLiteral(value: boolean, arg: TypeSystem): TypedBindingExpression {
    return {
      kind: BindingExpressionKind.Boolean,
      payload: value,
      resolved: true,
      semantics: Primitives.Boolean,
    };
  }
  visitBinding_NullLiteral(arg: TypeSystem): TypedBindingExpression {
    return {
      kind: BindingExpressionKind.Null,
      payload: null,
      resolved: true,
      semantics: null,
    };
  }
  visitBinding_Identifier(identifier: string, arg: TypeSystem): TypedBindingExpression {
    const global = arg.globals.lookup(identifier);
    if (global != null) {
      return {
        kind: BindingExpressionKind.Identifier,
        payload: identifier,
        resolved: true,
        semantics: global.type,
      };
    } else {
      return {
        kind: BindingExpressionKind.Identifier,
        payload: identifier,
        resolved: false,
        semantics: new Error(`No global '${identifier}' found.`),
      };
    }
  }
}

export const typeCheck = createFold<TypeSystem, BindingExpression, TypedBindingExpression>(new CoercionFolder())