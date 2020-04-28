import { BindingExpression, Chunk, UnitAnnotationPayload, PropertyExpressionPayload, FunctionCallExpressionPayload, GenericBindingExpression, ChunkKind, BindingExpressionKind } from "../ast/SyntaxTree";
import { Type, TypeSystem, Primitives, CoercionRule, TypeKind, ComplexTypeScope, MethodDescriptor } from "./TypeSystem";
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
      payload: this.coerceTypeIfNeeded(binding, arg, Primitives.String)
    };
  }

  private coerceTypeIfNeeded(binding: TypedBindingExpression, arg: TypeSystem, targetType: Type): TypedBindingExpression {
    return this.promiseWhenResolved(binding, bnd => {
      return this.promiseWhen(bnd, b => b.semantics === targetType, () => new Error("Cannot cast!"), bnd2 => {
        const castOperation = arg.getCoercionRule(bnd2.semantics as Type, targetType);
        return this.promiseWhen(bnd2, b => castOperation != null, () => new Error("No coercion rule!"), bnd3 => {
          return {
            kind: BindingExpressionKind.FunctionCall,
            payload: {
              operand: bnd3,
              parameters: []
            },
            resolved: true,
            semantics: targetType,
            operation: castOperation!
          };
        });
      });
    });
  }
  private promiseWhen(binding: TypedBindingExpression, predicate: ((binding: TypedBindingExpression) => boolean), createError: (binding: TypedBindingExpression) => Error, callback: BindingExpressionPromiseThenCallback): TypedBindingExpression {
    if (predicate(binding)) {
      return callback(binding);
    } else {
      return {
        kind: binding.kind,
        payload: binding.payload,
        resolved: false,
        semantics: createError(binding)
      };
    }
  }
  private promiseWhenResolved(binding: TypedBindingExpression, callback: BindingExpressionPromiseThenCallback): TypedBindingExpression {
    return this.promiseWhen(binding, b => b.resolved, b => b.semantics as Error, callback);
  }

  visitBinding_UnitAnnotation(annotation: UnitAnnotationPayload<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
    let targetType: Type = {
      kind: TypeKind.Measurable,
      description: annotation.unit
    };
    return this.coerceTypeIfNeeded(annotation.operand, arg, targetType);
  }
  visitBinding_Property(property: PropertyExpressionPayload<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
    const operand = property.operand;
    return this.promiseWhenResolved(operand, binding => {
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
    return this.promiseWhenResolved(functionCall.operand, binding => {
      const operandType = binding.semantics as Type;
      if (operandType.kind === TypeKind.Callable) {
        const methodDescriptor = operandType.description as MethodDescriptor;
        const castedParameters = functionCall.parameters.map((b, index) => this.coerceTypeIfNeeded(b, arg, methodDescriptor.formalParameters[index].type));
        return {
          kind: BindingExpressionKind.FunctionCall,
          payload: {
            operand: binding,
            parameters: castedParameters,
          },
          resolved: true,
          semantics: methodDescriptor.returnType
        };
      } else {
        return {
          kind: BindingExpressionKind.FunctionCall,
          payload: functionCall,
          resolved: false,
          semantics: new Error("Operand is not a function!")
        }
      }
    });
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