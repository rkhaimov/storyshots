import { EndpointParsingResult } from '../parse/types';
import ts, { EmitHint, ScriptTarget } from 'typescript';
import path from 'path';
import { Settings } from '../types';
import { createTestableEndpointsFileName } from './createTestableEndpointsFileName';

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
            createHelperImports(),
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
      f.createTypeReferenceNode(f.createIdentifier('MethodMeta'), undefined),
    ),
    f.createBlock(
      [
        f.createReturnStatement(
          f.createArrayLiteralExpression(
            meta.map((it) =>
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
                    f.createObjectLiteralExpression(
                      [
                        f.createPropertyAssignment(
                          f.createIdentifier('type'),
                          f.createStringLiteral('none'),
                        ),
                      ],
                      false,
                    ),
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
            f.createTypeReferenceNode(f.createIdentifier(it.input), undefined),
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

function createHelperImports() {
  return f.createImportDeclaration(
    undefined,
    f.createImportClause(
      false,
      undefined,
      f.createNamedImports([
        f.createImportSpecifier(
          false,
          undefined,
          f.createIdentifier('MethodMeta'),
        ),
      ]),
    ),
    f.createStringLiteral('@storyshots/rtk-codegen-adapter'),
    undefined,
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
          .flatMap((it) => [it.input, it.output])
          .map((it) =>
            f.createImportSpecifier(false, undefined, f.createIdentifier(it)),
          ),
      ),
    ),
    f.createStringLiteral(
      path.join('./', outputFile.replace(path.extname(outputFile), '')),
    ),
  );
}
