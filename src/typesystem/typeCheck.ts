import { Type, TypeSystem, Primitives, CoercionRule, TypeKind, ComplexTypeScope, MethodDescriptor } from "./TypeSystem";
import { createFold, AbstractSyntaxTreeFolder } from "../ast/fold";
import { BindingExpression, ExtendedBindingExpression, BindingChunk, BindingExpressionKind, ExtendedIdentifier, ExtendedStringLiteral, ExtendedNumberLiteral, ExtendedBooleanLiteral, ExtendedUnitAnnotation, ExtendedPropertyAccess, ExtendedFunctionCall, ExtendedNullLiteral, BaseUnitAnnotation, BasePropertyAccess, BaseFunctionCall } from "../ast/SyntaxTree";

export interface TypeExtension {
  resolved: boolean;
  semantics: Type | Error | null;
  operation?: CoercionRule;
}

export type TypedBindingExpression = ExtendedBindingExpression<TypeExtension>;

type TypedBindingExpressionPromiseThenCallback = (binding: TypedBindingExpression) => TypedBindingExpression;

class TypeChecker extends AbstractSyntaxTreeFolder<TypeSystem, {}, TypeExtension> {
  visitBinding(binding: ExtendedBindingExpression<{}>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    switch (binding.kind) {
      case BindingExpressionKind.Boolean: return this.visitBinding_BooleanLiteral(binding as unknown as ExtendedBooleanLiteral<{}>, arg);
      case BindingExpressionKind.Number: return this.visitBinding_NumberLiteral(binding as unknown as ExtendedNumberLiteral<{}>, arg);
      case BindingExpressionKind.String: return this.visitBinding_StringLiteral(binding as unknown as ExtendedStringLiteral<{}>, arg);
      case BindingExpressionKind.Null: return this.visitBinding_NullLiteral(binding as unknown as ExtendedNullLiteral<{}>, arg);
      case BindingExpressionKind.Identifier: return this.visitBinding_Identifier(binding as unknown as ExtendedIdentifier<{}>, arg);
      case BindingExpressionKind.PropertyAccess: {
        const propertyIn = binding as unknown as ExtendedPropertyAccess<{}>;
        const propertyOperandOut = this.visitBinding(propertyIn.operand, arg);
        return this.visitBinding_Property({
          kind: propertyIn.kind,
          name: propertyIn.name,
          operand: propertyOperandOut,
        }, arg);
      }
      case BindingExpressionKind.FunctionCall: {
        const functionCallIn = binding as unknown as ExtendedFunctionCall<{}>;
        const operandOut = this.visitBinding(functionCallIn.operand, arg);
        const parametersOut = functionCallIn.actualParameters.map(p => this.visitBinding(p, arg));
        return this.visitBinding_FunctionCall({
          ...functionCallIn,
          operand: operandOut,
          actualParameters: parametersOut
        }, arg);
      }
      case BindingExpressionKind.UnitAnnotation: {
        const unitAnnotationIn = binding as unknown as ExtendedUnitAnnotation<{}>;
        const operandOut = this.visitBinding(unitAnnotationIn.operand, arg);
        return this.visitBinding_UnitAnnotation({
          ...unitAnnotationIn,
          operand: operandOut
        }, arg);
      }
    }
  }
  visitChunk_Binding(chunk: BindingChunk<TypeExtension>, arg: TypeSystem): BindingChunk<TypeExtension> {
    return {
      ...chunk,
      binding: this.coerceTypeIfNeeded(chunk.binding, arg, Primitives.String)
    };
  }
  visitBinding_UnitAnnotation(annotation: BaseUnitAnnotation<TypeExtension>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    let targetType: Type = {
      kind: TypeKind.Measurable,
      description: annotation.unit
    };
    return this.coerceTypeIfNeeded(annotation.operand, arg, targetType);
  }
  visitBinding_Property(property: BasePropertyAccess<TypeExtension>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    const operand = property.operand;
    return this.promiseWhenResolved(operand, binding => {
      const template = {
        kind: BindingExpressionKind.PropertyAccess,
        name: property.name,
        operand: binding,
        resolved: false,
        semantics: null
      } as ExtendedPropertyAccess<TypeExtension>;
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
  visitBinding_FunctionCall(functionCall: BaseFunctionCall<TypeExtension>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
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
  visitBinding_StringLiteral(binding: ExtendedStringLiteral<{}>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    return {
      ...binding,
      resolved: true,
      semantics: Primitives.String,
    };
  }
  visitBinding_NumberLiteral(binding: ExtendedNumberLiteral<{}>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    return {
      ...binding,
      resolved: true,
      semantics: Primitives.Number,
    };
  }
  visitBinding_BooleanLiteral(binding: ExtendedBooleanLiteral<{}>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    return {
      ...binding,
      resolved: true,
      semantics: Primitives.Boolean,
    };
  }
  visitBinding_NullLiteral(binding: ExtendedNullLiteral<{}>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    return {
      kind: BindingExpressionKind.Null,
      resolved: true,
      semantics: null,
    };
  }
  visitBinding_Identifier(binding: ExtendedIdentifier<{}>, arg: TypeSystem): ExtendedBindingExpression<TypeExtension> {
    const global = arg.globals.lookup(binding.name);
    if (global != null) {
      return {
        ...binding,
        resolved: true,
        semantics: global.type,
      };
    } else {
      return {
        ...binding,
        resolved: false,
        semantics: new Error(`No global '${binding.name}' found.`),
      };
    }
  }
  private coerceTypeIfNeeded(binding: TypedBindingExpression, arg: TypeSystem, targetType: Type): TypedBindingExpression {
    return this.promiseWhenResolved(binding, bnd => {
      return this.promiseWhen(bnd, b => b.semantics === targetType, () => new Error("Cannot cast!"), bnd2 => {
        const castOperation = arg.getCoercionRule(bnd2.semantics as Type, targetType);
        return this.promiseWhen(bnd2, () => castOperation != null, () => new Error("No coercion rule!"), bnd3 => {
          return {
            kind: BindingExpressionKind.FunctionCall,
            actualParameters: [],
            operand: bnd3,
            resolved: true,
            semantics: targetType,
            operation: castOperation!
          };
        });
      });
    });
  }
  private promiseWhen(
    binding: TypedBindingExpression,
    predicate: ((binding: TypedBindingExpression) => boolean),
    createError: (binding: TypedBindingExpression) => Error,
    callback: TypedBindingExpressionPromiseThenCallback
  ): TypedBindingExpression {
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
  private promiseWhenResolved(binding: TypedBindingExpression, callback: TypedBindingExpressionPromiseThenCallback): TypedBindingExpression {
    return this.promiseWhen(binding, b => b.resolved, b => b.semantics as Error, callback);
  }
};

export const typeCheck = createFold<TypeSystem, BindingExpression, TypedBindingExpression>(new TypeChecker());