export interface IExternals {
  analytics: {
    log(event: string): void;
  };
  counter: {
    getInitialValue(date: string): Promise<number>;
  };
  environment: {
    now(): Date;
  };
}
