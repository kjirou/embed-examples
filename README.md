# embed-examples

[![npm version](https://badge.fury.io/js/embed-examples.svg)](https://badge.fury.io/js/embed-examples)
[![Build Status](https://travis-ci.org/kjirou/embed-examples.svg?branch=master)](https://travis-ci.org/kjirou/embed-examples)

Embed examples into README.md


## :rocket: Installation

```bash
npm install -g embed-examples
```


## :eyes: Overview

Thie module embeds examples into README.md.

For example, put the following file ...

`my-lib/README.md`)
```
# my-lib
<!-- embed-examples: examples/foo.js -->
```

`my-lib/examples/foo.js`)
```
const myLib = require('my-lib');
myLib.doSomething();
```

Executing the following command ...

```bash
embed-examples -o ./README.md
```

README.md is updated as follows!

`my-lib/README.md`)
````
# my-lib
<!-- embed-examples: examples/foo.js -->
<!-- embed-example -->
```
const myLib = require('my-lib');
myLib.doSomething();
```
<!-- /embed-example -->
````


## :scroll: Usage

```bash
embed-examples [OPTIONS] README_PATH
```

- `README_PATH`
  - Relative path to the README.md
- `OPTIONS`
  - `--examples-dir $VALUE`, `-e`
    - Base path for finding examples
    - **Default**: A directory path where README.md is located
  - `--newline-character $VALUE`, `-n`
    - Newline character used in markdown. However, do not change the sources of examples.
    - The value is `"LF"`, `"CR"` or `"CRLF"`
    - **Default**: `"LF"`
  - `--overwrite`, `-o`
    - Directly rewrite README.md with path specified
    - **Default**: Disabled
  - `--replacement $VALUE`, `-r`
    - Keywords to replace. Represent value in the form of `from,to`.
    - Can specify more than one like `-r keyword1,replacement1 -r keyword2,replacement2`
    - **Default**: None
