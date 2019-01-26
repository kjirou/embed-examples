export interface ExecutionResult {
  exitCode: number,
  outputErrorMessage: string,
}

export function execute(moduleName: string, inputDir: string, outputFile: string): Promise<ExecutionResult> {
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
