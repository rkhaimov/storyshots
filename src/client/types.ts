export type Node = Group | Story;

export type Group = {
  type: 'group';
  title: string;
  children: Node[];
};

export type Story = {
  type: 'story';
  title: string;
  render(): React.ReactNode;
};

