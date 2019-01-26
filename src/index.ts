export interface ExecutionResult {
  exitCode: number,
  outputErrorMessage: string,
}

// 1) READMEからクエリを探す
// 2) 要求するファイルパスリストを生成
// 3) ファイルパスリストから.jsリストを読み込む
// 4) .jsリストのmainModuleIdUsedInExampleをmoduleNameに置換
// 5) .jsリストがREADMEでどの位置にあるかを探し出してそれぞれ挿入する
// 6) 置換されたREADMEを標準出力

export function execute(
  moduleName: string,
  mainModuleIdUsedInExample: string,
  inputDirPath: string,
  outputFilePath: string
): Promise<ExecutionResult> {
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
