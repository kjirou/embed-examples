declare module 'remark' {
  // Ref) https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html
  // Ref) http://developer.hatenastaff.com/entry/2016/06/27/140931
  namespace defaultExports {
    function parse(markdownText: string): object;
  }
  export = defaultExports;
}
