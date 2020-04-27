import { Unit } from "../ast/SyntaxTree";

export interface TypeSystem {
  global: ComplexTypeScope;
}

export interface ComplexTypeProperty {
  name: string;
  type: Type;
}

export interface ComplexTypeScope {
  lookup(name: string): ComplexTypeProperty | null;
  listAll(): ComplexTypeProperty[];
}

export class TypeChecker { }

export enum TypeKind {
  Primitive,
  Measurable,
  Callable,
  Complex
}

export interface Type {
  kind: TypeKind;
  description: string | Unit | ComplexTypeScope;
}

export namespace Primitives {
  export const String: Type = { kind: TypeKind.Primitive, description: "String" };
  export const Boolean: Type = { kind: TypeKind.Primitive, description: "Boolean" };
  export const Number: Type = { kind: TypeKind.Primitive, description: "Number" };
}

export namespace Measureables {
  export const PX: Type = { kind: TypeKind.Measurable, description: Unit.Pixels };
  export const MM: Type = { kind: TypeKind.Measurable, description: Unit.Millimeter };
  export const CM: Type = { kind: TypeKind.Measurable, description: Unit.Centimeter };
  export const PT: Type = { kind: TypeKind.Measurable, description: Unit.Points };
  export const INCH: Type = { kind: TypeKind.Measurable, description: Unit.Inch };
}