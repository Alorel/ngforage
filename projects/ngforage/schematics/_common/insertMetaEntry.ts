import {UpdateRecorder} from '@angular-devkit/schematics';
import {getDecoratorMetadata, getMetadataField} from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';

export function insertMetaEntry(field: string, file: ts.SourceFile, recorder: UpdateRecorder, def: string): boolean {
  let node = getDecoratorMetadata(file, 'NgModule', '@angular/core')[0];
  const objNode = node as ts.ObjectLiteralExpression;

  let position: number;
  let toInsert: string;

  const matchingProps = getMetadataField(objNode, field);
  if (!matchingProps.length) {
    // field not found
    if (!objNode.properties.length) {
      position = node.getEnd() - 1;
      toInsert = `  ${field}: [\n    ${def}\n  ]`;
    } else {
      node = objNode.properties[objNode.properties.length - 1];
      position = node.getEnd();

      // Get the indentation of the last element, if any.
      const text = node.getFullText();
      const matches = text.match(/^\r?\n\s*/);
      toInsert = matches && matches.length ?
        `,${matches[0]}${field}: [\n    ${def}\n  ]` :
        `, ${field}: [\n    ${def}\n  ]`;
    }
  } else {
    const arrLiteral = (matchingProps[0] as any).initializer;

    if (ts.isArrayLiteralExpression(arrLiteral)) {
      let prefix = '\n    ';
      let indexSubtract: number;

      if (arrLiteral.elements.length) {
        node = arrLiteral.elements[arrLiteral.elements.length - 1];
        prefix = ',' + prefix;
        indexSubtract = 0;
      } else {
        node = arrLiteral;
        indexSubtract = 1;
      }

      position = node.getEnd() - indexSubtract;
      toInsert = prefix + def;
    } else {
      return false;
    }
  }

  recorder.insertLeft(position, toInsert);

  return true;
}
