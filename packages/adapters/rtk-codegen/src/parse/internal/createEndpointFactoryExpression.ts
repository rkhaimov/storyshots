import ts, { PropertyAssignment } from 'typescript';
import { narrow } from './narrow';

export function createEndpointFactoryExpression(
  assignment: PropertyAssignment,
) {
  return narrow(assignment.initializer)
    .ensure(ts.isCallExpression, (it) => it)
    .fold();
}
