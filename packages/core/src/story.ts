import { ActionMeta } from './actor/types';
import { Brand, SubBrand } from './brand';
import { Device } from './config';
import { assert, isNil } from './utils';

export type FileNameLike = Brand<string, 'FileName'>;

export type StoryID = SubBrand<FileNameLike, 'StoryID'>;

export type GroupID = SubBrand<FileNameLike, 'GroupID'>;

export function createGroupID(value: string, parent?: GroupID) {
  return join(parent, value) as GroupID;
}

export function createStoryID(value: string, parent?: GroupID) {
  return join(parent, value) as StoryID;
}

/**
 * Returns parents chain of story
 */
export function parseStoryID(id: StoryID): GroupID[] {
  return id
    .split('__')
    .slice(0, -1)
    .map((_, index, parts) => parts.slice(0, index + 1).join('__') as GroupID);
}

/**
 * Represents serializable version of story nodes
 */
export type PureStoryTree = PureGroup | PureStory;

export type PureGroup = {
  id: GroupID;
  type: 'group';
  title: string;
  children: PureStoryTree[];
};

export type PureStory = {
  id: StoryID;
  type: 'story';
  title: string;
  cases: PureStoryCase[];
};

export type PureStoryCase = {
  device: Device;
  retries: number;
  actions: ActionMeta[];
};

function join(parent: GroupID | undefined, child: string): FileNameLike {
  if (isNil(parent)) {
    return sanitize(child);
  }

  const joint = `${parent}__${sanitize(child)}`;

  assertMaxLength(joint);

  return joint as FileNameLike;
}

function sanitize(value: string): FileNameLike {
  assertMaxLength(value);
  assertValidChars(value);

  return value.toLowerCase().replace(/ /g, '_') as FileNameLike;
}

function assertValidChars(value: string) {
  assert(
    !/[^a-z0-9 ]/i.test(value),
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
