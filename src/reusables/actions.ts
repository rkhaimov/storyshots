import type { AriaRole } from 'react';

export type ActorMeta = {
  action: 'click';
  payload: {
    on: FinderMeta;
  };
};

export type FinderMeta = {
  selector: 'aria';
  payload: {
    role: AriaRole;
    attrs?: AriaAttrs;
  };
};

export type AriaAttrs = { name: string };
