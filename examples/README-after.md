# Embedding example

[README-after.md](/examples/README-after.md) is the result of executing the following command.

```bash
embed-examples examples/README-before.md > examples/README-after.md
```

<!-- embed-examples: foo.js --><!-- embedded-example -->
```
const embedExamples = require("../dist/index");

// foo.js
```
<!-- /embedded-example -->

<!-- embed-examples: subdir/bar.html --><!-- embedded-example -->
```
<html>
<body>Embedded!</body>
</html>
```
<!-- /embedded-example -->
