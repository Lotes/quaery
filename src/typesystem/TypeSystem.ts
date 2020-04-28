import { Unit } from "../ast/SyntaxTree";

export interface CoercionRule { }

export interface TypeSystem {
  globals: ComplexTypeScope;
  getCoercionRule(sourceType: Type, targetType: Type): CoercionRule | null;
}

export interface ComplexTypeProperty {
  name: string;
  type: Type;
}

export interface ComplexTypeScope {
  lookup(name: string): ComplexTypeProperty | null;
  list(): ComplexTypeProperty[];
}

export enum TypeKind {
  Primitive,
  Measurable,
  Callable,
  Complex
}

export interface Type {
  kind: TypeKind;
  description: string | Unit | ComplexTypeScope | MethodDescriptor;
}

export interface MethodDescriptor {
  returnType: Type;
  formalParameters: FormalParameter[];
  operation(self: any, actualParameters: any[]): any;
}

export interface FormalParameter {
  name: string;
  type: Type;
}

export namespace Primitives {
  export const String: Type = { kind: TypeKind.Primitive, description: "String" };
  export const Boolean: Type = { kind: TypeKind.Primitive, description: "Boolean" };
  export const Number: Type = { kind: TypeKind.Primitive, description: "Number" };
}