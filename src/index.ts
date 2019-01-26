const fs = require('fs');

// 1) READMEからクエリを探す
// 2) 要求するファイルパスリストを生成
// 3) ファイルパスリストから.jsリストを読み込む
// 4) .jsリストのmainModuleIdUsedInExampleをmoduleNameに置換
// 5) .jsリストがREADMEでどの位置にあるかを探し出してそれぞれ挿入する
// 6) 置換されたREADMEを標準出力

export interface EmbeddingDirection {
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
  const directions = searchEmbeddingDirections(readmeText);
  console.log(directions);

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
