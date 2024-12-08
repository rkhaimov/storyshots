import ts from 'typescript';

const f = ts.factory;

export function createPackageImports() {
  return f.createImportDeclaration(
    undefined,
    f.createImportClause(
      false,
      undefined,
      f.createNamedImports([
        f.createImportSpecifier(
          false,
          undefined,
          f.createIdentifier('RequestHandlerMeta'),
        ),
        f.createImportSpecifier(
          false,
          undefined,
          f.createIdentifier('createHandlerMetaFromEndpoint'),
        ),
      ]),
    ),
    f.createStringLiteral('@storyshots/rtk-codegen-adapter'),
    undefined,
  );
}
