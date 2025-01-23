import { ExpectedResults } from '../getExpectedResults';
import { BasePayload } from '../types';

export type ExpectedPayload = BasePayload & { expected: ExpectedResults };
