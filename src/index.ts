const fs = require('fs');
const path = require('path');

// 1) READMEからクエリを探す
// 2) 要求するファイルパスリストを生成
// 3) ファイルパスリストから.jsリストを読み込む
// 4) .jsリストのmainModuleIdUsedInExampleをmoduleNameに置換
// 5) .jsリストがREADMEでどの位置にあるかを探し出してそれぞれ挿入する
// 6) 置換されたREADMEを標準出力

interface EmbeddingDirection {
  directionStartIndex: number,
  directionEndIndex: number,
  filePath: string,
  hasEmbeddedExample: boolean,
  embeddedExampleStartIndex: number,
  embeddedExampleEndIndex: number,
}

function searchEmbeddingDirections(readmeText: string): EmbeddingDirection[] {
  const regExp = /<!-- *embed-examples: *(.+?) *-->(```(.+?)```)?/g;
  const directions = [];
  let matched;
  while (matched = regExp.exec(readmeText)) {
    const directionEndIndex = regExp.lastIndex - 1;
    const embeddedExample = matched[2] || '';
    const hasEmbeddedExample = Boolean(embeddedExample);
    const embeddedExampleStartIndex = hasEmbeddedExample ? directionEndIndex + 1 : 0;
    const embeddedExampleEndIndex = hasEmbeddedExample ? embeddedExampleStartIndex + embeddedExample.length - 1 : 0;

    directions.push({
      directionStartIndex: matched.index,
      directionEndIndex,
      filePath: matched[1],
      hasEmbeddedExample,
      embeddedExampleStartIndex,
      embeddedExampleEndIndex,
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

export interface ExecutionResult {
  exitCode: number,
  outputErrorMessage: string,
}

export function execute(
  moduleName: string,
  mainModuleIdUsedInExample: string,
  readmeFilePath: string,
  examplesDirPath: string
): Promise<ExecutionResult> {
  const readmeText = fs.readFileSync(readmeFilePath).toString();
  // TODO: Handle a failure to read
  const reversedDirections = searchEmbeddingDirections(readmeText).reverse();
  console.log(reversedDirections);
  const exampleSourceMap = replaceToPublicModuleId(
    fetchExamples(examplesDirPath, reversedDirections),
    mainModuleIdUsedInExample,
    moduleName
  );
  console.log(exampleSourceMap);

  return Promise.resolve()
    .then(() => {
      if (moduleName === 'e') {
        return {
          exitCode: 1,
          outputErrorMessage: 'ERROR!',
        };
      } else {
        return {
          exitCode: 0,
          outputErrorMessage: '',
        };
      }
    });
};
