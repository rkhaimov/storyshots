type Node = Group | Story;

export type Group = {
  type: 'group';
  title: string;
  children: Node[];
};

export type Story = {
  type: 'story';
  title: string;
  commands: CommandsSnapshot;
  arrange(externals: unknown): never;
  act(actor: Actor, find: Finder): Actor;
};

type Actor = {
  settle(): Actor;
  click(on: FinderResult): Actor;
  enterText(on: FinderResult): Actor;
  screenshot(label: string): Actor;
};

type Finder = {
  text(content: string): FinderResult;
};

type FinderResult = never;

type CommandsSnapshot = string & { __CommandsSnapshot: 'CommandsSnapshot' };
