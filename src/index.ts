const fs = require('fs');
const path = require('path');

interface EmbeddingDirection {
  directionStartIndex: number,
  directionEndIndex: number,
  directionBody: string,
  filePath: string,
}

function searchEmbeddingDirections(readmeText: string): EmbeddingDirection[] {
  const regExp = /(<!-- *embed-examples: *(.+?) *-->)(?:<!-- embedded-example -->```.+?```<!-- \/embedded-example -->)?/g;
  const directions = [];
  let matched;
  while (matched = regExp.exec(readmeText)) {
    directions.push({
      directionStartIndex: matched.index,
      directionEndIndex: regExp.lastIndex - 1,
      directionBody: matched[1],
      filePath: matched[2],
    });
  }
  return directions;
}

interface ExampleSourceMap {
  [filePath: string]: string,
}

function fetchExamples(basePath: string, directions: EmbeddingDirection[]): ExampleSourceMap {
  const examples: ExampleSourceMap = {};
  directions.forEach(direction => {
    const source = fs.readFileSync(path.join(basePath, direction.filePath)).toString();
    // TODO: Handle a failure to read
    examples[direction.filePath] = source;
  });
  return examples;
}

/**
 * Copied from: https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions
 */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
}

function replaceToPublicModuleId(
  examples: ExampleSourceMap,
  mainModuleIdUsedInExample: string,
  moduleName: string
): ExampleSourceMap {
  Object.keys(examples).forEach(key => {
    ["'", '"', '`'].forEach(quote => {
      examples[key] = examples[key].replace(
        new RegExp(
          `${quote}${escapeRegExp(mainModuleIdUsedInExample)}${quote}`,
          'g'
        ),
        `${quote}${moduleName}${quote}`
      );
    });
  });
  return examples;
}

function embedExamplesIntoReadme(
  readmeText: string,
  directions: EmbeddingDirection[],
  examples: ExampleSourceMap,
): string {
  const directionsOrderdFromTail =
    directions.slice().sort((a, b) => b.directionStartIndex - a.directionStartIndex);
  let newReadmeText = readmeText;
  directionsOrderdFromTail.forEach(direction => {
    newReadmeText = newReadmeText.slice(0, direction.directionStartIndex) +
      direction.directionBody +
      '<!-- embedded-example -->```\n' + examples[direction.filePath] + '```<!-- embedded-example -->' +
      newReadmeText.slice(direction.directionEndIndex + 1);
  });
  return newReadmeText;
}

export interface ExecutionResult {
  exitCode: number,
  output: string,
  outputErrorMessage: string,
}

export function execute(
  moduleName: string,
  mainModuleIdUsedInExample: string,
  readmeFilePath: string,
  examplesDirPath: string
): ExecutionResult {
  const readmeText = fs.readFileSync(readmeFilePath).toString();
  // TODO: Handle a failure to read
  const directions = searchEmbeddingDirections(readmeText);
  const exampleSourceMap = replaceToPublicModuleId(
    fetchExamples(examplesDirPath, directions),
    mainModuleIdUsedInExample,
    moduleName
  );
  const embeddedReadmeText = embedExamplesIntoReadme(readmeText, directions, exampleSourceMap);
  return {
    exitCode: 0,
    output: embeddedReadmeText,
    outputErrorMessage: '',
  };
};
