export class AggregateError extends Error {
  errors: Error[];
  constructor(errors: Error[]) {
    super("Multiple errors occurred.");
    this.errors = this.flatten(errors);
  }
  private flatten(errors: Error[]): Error[] {
    let flattened: Error[] = [];
    errors.forEach(e => {
      if (e instanceof AggregateError) {
        flattened = flattened.concat(e.errors)
      } else {
        flattened.push(e);
      }
    });
    return flattened;
  }
}