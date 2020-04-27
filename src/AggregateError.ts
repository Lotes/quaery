export class AggregateError extends Error {
  errors: Error[];
  constructor(errors: Error[]) {
    super(`${errors.length} errors occurred.`);
    this.errors = errors;
  }
}