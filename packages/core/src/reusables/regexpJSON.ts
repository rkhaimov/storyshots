export function createRegexpJSON(object: unknown) {
  return JSON.stringify(object, (_, value) =>
    value instanceof RegExp
      ? ({
          type: 'regexp',
          source: value.source,
          flags: value.flags,
        } satisfies SerializedRegExp)
      : value,
  );
}

export function regexpJSONReviver(_: unknown, value: unknown) {
  if (isSerializedRegExp(value)) {
    return new RegExp(value.source, value.flags);
  }

  return value;
}

function isSerializedRegExp(value: unknown): value is SerializedRegExp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'regexp'
  );
}

type SerializedRegExp = {
  type: 'regexp';
  source: string;
  flags: string;
};
