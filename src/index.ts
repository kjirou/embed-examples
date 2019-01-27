import * as fs from 'fs';
import * as path from 'path';
import * as remark from 'remark';

const EMBEDDED_EXAMPLE_START_TAG = '<!-- embedded-example -->';
const EMBEDDED_EXAMPLE_END_TAG = '<!-- /embedded-example -->';

/**
 * Copied from: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions
 */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
}

type NewlineCharacterSetting = 'LF' | 'CR' | 'CRLF';

function getNewlineCharacter(newlineCharacterSetting: NewlineCharacterSetting): string {
  return {
    LF: '\n',
    CR: '\r',
    CRLF: '\r\n',
  }[newlineCharacterSetting];
}

interface EmbeddingDirection {
  directionStartIndex: number,
  directionEndIndex: number,
  directionBody: string,
  filePath: string,
};

function searchEmbeddingDirections(readmeText: string): EmbeddingDirection[] {
  //const regExp = new RegExp(
  //  [
  //    '(<!-- *embed-examples: *(.+?) *-->)',
  //    '(?:',
  //    escapeRegExp(EMBEDDED_EXAMPLE_START_TAG) + '(?:\r\n|[\n\r])',
  //    '```(?:\r\n|[\n\r]|.)+?```(?:\r\n|[\n\r])',
  //    escapeRegExp(EMBEDDED_EXAMPLE_END_TAG),
  //    ')?',
  //  ].join(''),
  //  'g'
  //);
  //const directions = [];
  //let matched;
  //while (matched = regExp.exec(readmeText)) {
  //  directions.push({
  //    directionStartIndex: matched.index,
  //    directionEndIndex: regExp.lastIndex - 1,
  //    directionBody: matched[1],
  //    filePath: matched[2],
  //  });
  //}

  const directions = [];

  function walkAst(
    astNode: RemarkAstNode,
    parentAstNode: RemarkAstNode | null,
    callback: (astNode: RemarkAstNode, parentAstNode: RemarkAstNode | null) => void
  ) {
    callback(RemarkAstNode, parentAstNode);
    (astNode.children || []).forEach(astNode_ => {
      walkAst(astNode_, astNode, callback);
    });
  }

  const ast: RemarkAstNode = remark.parse(readmeText);

  walkAst(
    ast,
    null,
    (astNode, parentAstNode) => {
      if (
        astNode.type === 'html' &&
        /<!-- *embed-examples: *(.+?) *-->/.test(astNode.value)
      ) {
        const siblings
        if (
        ) {
        } else {
        }
      }
    }
  );

  const regExp = new RegExp(
    [
      '(<!-- *embed-examples: *(.+?) *-->)',
      '(?:',
      escapeRegExp(EMBEDDED_EXAMPLE_START_TAG) + '(?:\r\n|[\n\r])',
      '```(?:\r\n|[\n\r]|.)+?```(?:\r\n|[\n\r])',
      escapeRegExp(EMBEDDED_EXAMPLE_END_TAG),
      ')?',
    ].join(''),
    'g'
  );

  return directions;
}

interface ExampleSourcesMap {
  [filePath: string]: string,
};

function fetchExamples(basePath: string, directions: EmbeddingDirection[]): ExampleSourcesMap {
  const examples: ExampleSourcesMap = {};
  directions.forEach(direction => {
    examples[direction.filePath] = fs.readFileSync(path.join(basePath, direction.filePath)).toString();
  });
  return examples;
}

interface ReplacementKeyword {
  from: string,
  to: string,
};

function replaceKeywords(
  examples: ExampleSourcesMap,
  replacementKeywords: ReplacementKeyword[],
): ExampleSourcesMap {
  const newExamples: ExampleSourcesMap = {};
  Object.keys(examples).forEach(key => {
    let source = examples[key];
    replacementKeywords.forEach(replacement => {
      source = source.replace(
        new RegExp(escapeRegExp(replacement.from), 'g'),
        replacement.to
      );
    });
    newExamples[key] = source;
  });
  return newExamples;
}

function embedExamplesIntoReadme(
  readmeText: string,
  directions: EmbeddingDirection[],
  examples: ExampleSourcesMap,
  newlineCharacterSetting: NewlineCharacterSetting,
): string {
  const directionsOrderdFromTail =
    directions.slice().sort((a, b) => b.directionStartIndex - a.directionStartIndex);
  const newlineCharacter = getNewlineCharacter(newlineCharacterSetting);
  let newReadmeText = readmeText;
  directionsOrderdFromTail.forEach(direction => {
    newReadmeText = newReadmeText.slice(0, direction.directionStartIndex) +
      direction.directionBody +
      EMBEDDED_EXAMPLE_START_TAG + newlineCharacter +
      '```' + newlineCharacter + examples[direction.filePath] + '```' + newlineCharacter +
      EMBEDDED_EXAMPLE_END_TAG +
      newReadmeText.slice(direction.directionEndIndex + 1);
  });
  return newReadmeText;
}

export function execute(
  readmeText: string,
  examplesDirPath: string,
  replacementKeywords: ReplacementKeyword[],
  NewlineCharacterSetting: NewlineCharacterSetting,
): string {
  const directions = searchEmbeddingDirections(readmeText);
  const exampleSourcesMap = replaceKeywords(
    fetchExamples(examplesDirPath, directions),
    replacementKeywords
  );
  return embedExamplesIntoReadme(readmeText, directions, exampleSourcesMap, NewlineCharacterSetting);
};
