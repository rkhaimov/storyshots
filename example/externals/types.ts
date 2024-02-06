export interface IExternals {
  analytics: {
    log(event: string): void;
  };
  balance: {
    getBalanceAt(date: Date): Promise<number>;
  };
  environment: {
    now(): Date;
  };
}
