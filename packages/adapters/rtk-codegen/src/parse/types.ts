export type ServiceParsingResult = EndpointParsingResult[];

export type EndpointParsingResult = {
  name: string;
  url: string;
  method: string;
  args: ArgParsingResult[];
  input: string;
  output: string;
};

export type PathArg = { from: 'path'; name: string; type: string };

export type QueryArg = { from: 'query'; name: string; type: string };

export type BodyArg = { from: 'body'; name: string };

type ArgParsingResult = PathArg | QueryArg | BodyArg;
