import ts, { EmitHint, ScriptTarget } from 'typescript';
import path from 'path';
import { EndpointParsingResult, Settings } from '../types';
import { createTestableEndpointsFileName } from './createTestableEndpointsFileName';
import { createPackageImports } from './createPackageImports';

const f = ts.factory;

export function generate(
  name: string,
  settings: Settings,
  meta: EndpointParsingResult[],
) {
  return {
    file: createTestableEndpointsFileName(settings),
    code: ts
      .createPrinter()
      .printNode(
        EmitHint.Unspecified,
        f.createSourceFile(
          [
            createPackageImports(),
            createMethodTypeImports(settings.outputFile, meta),
            createAPIInterfaceExport(name, meta),
            createMetaFactory(name, meta),
          ],
          f.createToken(ts.SyntaxKind.EndOfFileToken),
          ts.NodeFlags.None,
        ),
        ts.createSourceFile('source.ts', '', ScriptTarget.Latest),
      ),
  };
}

function createMetaFactory(name: string, meta: EndpointParsingResult[]) {
  return f.createFunctionDeclaration(
    [f.createToken(ts.SyntaxKind.ExportKeyword)],
    undefined,
    f.createIdentifier(`create${name}Meta`),
    undefined,
    [
      f.createParameterDeclaration(
        undefined,
        undefined,
        f.createIdentifier('repository'),
        undefined,
        f.createTypeReferenceNode(f.createIdentifier(name), undefined),
        undefined,
      ),
    ],
    f.createArrayTypeNode(
      f.createTypeReferenceNode(
        f.createIdentifier('RequestHandlerMeta'),
        undefined,
      ),
    ),
    f.createBlock(
      [
        f.createReturnStatement(
          f.createArrayLiteralExpression(
            meta.map((it) =>
              f.createCallExpression(
                f.createIdentifier('createHandlerMetaFromEndpoint'),
                undefined,
                [
                  f.createObjectLiteralExpression(
                    [
                      f.createPropertyAssignment(
                        f.createIdentifier('url'),
                        f.createStringLiteral(it.url),
                      ),
                      f.createPropertyAssignment(
                        f.createIdentifier('method'),
                        f.createStringLiteral(it.method.toLowerCase()),
                      ),
                      f.createPropertyAssignment(
                        f.createIdentifier('arg'),
                        f.createIdentifier(JSON.stringify(it.input.type)),
                      ),
                      f.createPropertyAssignment(
                        f.createIdentifier('body'),
                        f.createIdentifier(it.input.body ?? 'undefined'),
                      ),
                      f.createPropertyAssignment(
                        f.createIdentifier('handler'),
                        f.createPropertyAccessExpression(
                          f.createIdentifier('repository'),
                          f.createIdentifier(it.name),
                        ),
                      ),
                    ],
                    true,
                  ),
                ],
              ),
            ),
            true,
          ),
        ),
      ],
      true,
    ),
  );
}

function createAPIInterfaceExport(name: string, meta: EndpointParsingResult[]) {
  return f.createInterfaceDeclaration(
    [f.createToken(ts.SyntaxKind.ExportKeyword)],
    f.createIdentifier(name),
    undefined,
    undefined,
    meta.map((it) =>
      f.createMethodSignature(
        undefined,
        f.createIdentifier(it.name),
        undefined,
        undefined,
        [
          f.createParameterDeclaration(
            undefined,
            undefined,
            f.createIdentifier('arg'),
            undefined,
            f.createTypeReferenceNode(
              f.createIdentifier(it.input.name),
              undefined,
            ),
            undefined,
          ),
        ],
        f.createTypeReferenceNode(f.createIdentifier('Promise'), [
          f.createTypeReferenceNode(f.createIdentifier(it.output), undefined),
        ]),
      ),
    ),
  );
}

function createMethodTypeImports(
  outputFile: string,
  meta: EndpointParsingResult[],
) {
  return f.createImportDeclaration(
    undefined,
    f.createImportClause(
      true,
      undefined,
      f.createNamedImports(
        meta
          .flatMap((it) => [it.input.name, it.output])
          .map((it) =>
            f.createImportSpecifier(false, undefined, f.createIdentifier(it)),
          ),
      ),
    ),
    f.createStringLiteral(
      `./${path.basename(outputFile).replace(path.extname(outputFile), '')}`,
    ),
  );
}
