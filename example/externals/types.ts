export interface IExternals {
  analytics: {
    log(event: string): void;
  };
  business: {
    getBalanceAt(date: number): Promise<number>;
    applyCV(form: unknown): Promise<void>;
  };
  environment: {
    now(): Date;
  };
}
