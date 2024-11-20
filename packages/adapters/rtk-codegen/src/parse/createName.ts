import ts, { PropertyAssignment } from 'typescript';
import { narrow } from './internal/narrow';

export function createName(endpoint: PropertyAssignment) {
  return narrow(endpoint.name)
    .ensure(ts.isIdentifier, (it) => it.text)
    .fold();
}
