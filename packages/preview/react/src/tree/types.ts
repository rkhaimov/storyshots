import { Group } from './describe';
import { Story } from './it';
import { StoryAggregate } from './each';

export type StoryTree = Group | Story | StoryAggregate;
