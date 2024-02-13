export interface IExternals {
  analytics: {
    log(event: string): void;
  };
  business: {
    getBalanceAt(date: Date): Promise<number>;
    applyCV(form: unknown): Promise<void>;
  };
  environment: {
    now(): Date;
  };
}
