import { assert, isNil } from '@lib';
import { Brand, SubBrand } from '../brand';

export type StoryID = SubBrand<FileNameLike, 'StoryID'>;

export type GroupID = SubBrand<FileNameLike, 'GroupID'>;

export function createGroupID(value: string, parent?: GroupID) {
  return join(parent, value) as GroupID;
}

export function createStoryID(value: string, parent?: GroupID) {
  return join(parent, value) as StoryID;
}

export function parseStoryID(id: StoryID): GroupID[] {
  return id
    .split('__')
    .slice(0, -1)
    .map((_, index, parts) => parts.slice(0, index + 1).join('__') as GroupID);
}

function join(parent: GroupID | undefined, child: string): FileNameLike {
  if (isNil(parent)) {
    return sanitize(child);
  }

  return sanitize(`${parent}__${sanitize(child)}`);
}

function sanitize(value: string): FileNameLike {
  assertMaxLength(value);

  const noSpaces = value.toLowerCase().replace(/ /g, '_');

  assertValidChars(noSpaces);

  return noSpaces;
}

function assertValidChars(value: string): asserts value is FileNameLike {
  assert(
    !/[^a-z0-9_]/i.test(value),
    `Invalid characters detected. Only Latin letters and numbers are allowed. Cause: ${value}`,
  );
}

const MAX_FILE_NAME_LENGTH = 255;

function assertMaxLength(value: string) {
  assert(
    value.length <= MAX_FILE_NAME_LENGTH,
    `File name is too long. Maximum allowed length is ${MAX_FILE_NAME_LENGTH} characters. Cause: ${value}`,
  );
}

type FileNameLike = Brand<string, 'FileName'>;
