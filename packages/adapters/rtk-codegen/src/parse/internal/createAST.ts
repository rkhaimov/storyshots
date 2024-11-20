import ts, { SourceFile } from 'typescript';

export function createAST(code: string): SourceFile {
  return ts.createSourceFile('source.ts', code, ts.ScriptTarget.Latest, true);
}
