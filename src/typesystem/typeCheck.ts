import { Type, TypeSystem, Primitives, CoercionRule, TypeKind, ComplexTypeScope, MethodDescriptor } from "./TypeSystem";
import { createFold, AbstractSyntaxTreeFolder } from "../ast/fold";
import { BindingExpression, GenericBindingExpression, Chunk, ChunkKind, BindingChunk, BindingExpressionKind, UnitAnnotation, PropertyAccess, Identifier, BooleanLiteral, NumberLiteral, FunctionCall, StringLiteral } from "../ast/SyntaxTree";

export interface TypedBindingExpression extends GenericBindingExpression<TypedBindingExpression> {
  resolved: boolean;
  semantics: Type | Error | null;
  operation?: CoercionRule;
}

type BindingExpressionPromiseThenCallback = (binding: TypedBindingExpression) => TypedBindingExpression;

class CoercionFolder extends AbstractSyntaxTreeFolder<TypeSystem, BindingExpression, TypedBindingExpression> {
  visitChunk_Binding(chunk: BindingChunk<TypedBindingExpression>, arg: TypeSystem): BindingChunk<TypedBindingExpression> {
    return {
      ...chunk,
      binding: this.coerceTypeIfNeeded(chunk.binding, arg, Primitives.String)
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
        ...binding,
        resolved: false,
        semantics: createError(binding)
      };
    }
  }
  private promiseWhenResolved(binding: TypedBindingExpression, callback: BindingExpressionPromiseThenCallback): TypedBindingExpression {
    return this.promiseWhen(binding, b => b.resolved, b => b.semantics as Error, callback);
  }

  visitBinding_UnitAnnotation(annotation: UnitAnnotation<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
    let targetType: Type = {
      kind: TypeKind.Measurable,
      description: annotation.unit
    };
    return this.coerceTypeIfNeeded(annotation.operand, arg, targetType);
  }

  visitBinding_Property(property: PropertyAccess<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
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
  visitBinding_FunctionCall(functionCall: FunctionCall<TypedBindingExpression>, arg: TypeSystem): TypedBindingExpression {
    return this.promiseWhenResolved(functionCall.operand, binding => {
      const operandType = binding.semantics as Type;
      if (operandType.kind === TypeKind.Callable) {
        const methodDescriptor = operandType.description as MethodDescriptor;
        const castedParameters = functionCall.actualParameters.map((b, index) => this.coerceTypeIfNeeded(b, arg, methodDescriptor.formalParameters[index].type));
        return {
          ...functionCall,
          operand: binding,
          actualParameters: castedParameters,
          resolved: true,
          semantics: methodDescriptor.returnType
        };
      } else {
        return {
          ...functionCall,
          resolved: false,
          semantics: new Error("Operand is not a function!")
        }
      }
    });
  }

  visitBinding_StringLiteral(binding: StringLiteral<BindingExpression>, arg: TypeSystem): TypedBindingExpression {
    return {
      ...binding,
      resolved: true,
      semantics: Primitives.String,
    };
  }
  visitBinding_NumberLiteral(binding: NumberLiteral<BindingExpression>, arg: TypeSystem): TypedBindingExpression {
    return {
      ...binding,
      resolved: true,
      semantics: Primitives.Number,
    };
  }
  visitBinding_BooleanLiteral(binding: BooleanLiteral<BindingExpression>, arg: TypeSystem): TypedBindingExpression {
    return {
      ...binding,
      resolved: true,
      semantics: Primitives.Boolean,
    };
  }
  visitBinding_NullLiteral(arg: TypeSystem): TypedBindingExpression {
    return {
      kind: BindingExpressionKind.Null,
      resolved: true,
      semantics: null,
    };
  }
  visitBinding_Identifier(identifier: Identifier<BindingExpression>, arg: TypeSystem): TypedBindingExpression {
    const global = arg.globals.lookup(identifier.name);
    if (global != null) {
      return {
        ...identifier,
        resolved: true,
        semantics: global.type,
      };
    } else {
      return {
        ...identifier,
        resolved: false,
        semantics: new Error(`No global '${identifier}' found.`),
      };
    }
  }
}

export const typeCheck = createFold<TypeSystem, BindingExpression, TypedBindingExpression>(new CoercionFolder())