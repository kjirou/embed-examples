import * as assert from 'assert';
import {describe, it} from 'mocha';
import * as path from 'path';

import {execute} from '../src/index';

const examplesDirPath = path.join(__dirname, 'examples');

describe('index', function() {
  describe('execute', function() {
    describe('Embedding success', function() {
      describe('When there is one direction', function() {
        it('can embed an example', function() {
          assert.strictEqual(
            execute('<!-- embed-examples: foo.js -->', 'my-module', '../index', examplesDirPath),
            [
              "<!-- embed-examples: foo.js --><!-- embedded-example -->```",
              "const foo = require('my-module');",
              "```<!-- /embedded-example -->",
            ].join('\n')
          );
        });

        it('should not change when replacing continuously', function() {
          const first = execute('<!-- embed-examples: foo.js -->', 'my-module', '../index', examplesDirPath);
          const second = execute(first, 'my-module', '../index', examplesDirPath);
          assert.strictEqual(first, second);
        });

        it('can not replace to module-name when the passed main-module-id does not exist', function() {
          assert.strictEqual(
            execute('<!-- embed-examples: foo.js -->', 'my-module', '../not-exist', examplesDirPath),
            [
              "<!-- embed-examples: foo.js --><!-- embedded-example -->```",
              "const foo = require('../index');",
              "```<!-- /embedded-example -->",
            ].join('\n')
          );
        });

        it('should not replace no quote strings as main-module-id', function() {
          assert.strictEqual(
            execute('<!-- embed-examples: no-quote-strings.js -->', 'my-module', '../index', examplesDirPath),
            [
              "<!-- embed-examples: no-quote-strings.js --><!-- embedded-example -->```",
              "const noQuoteStrings = require('my-module');",
              "const x = ' ../index ';",
              "```<!-- /embedded-example -->",
            ].join('\n')
          );
        });
      });

      describe('When there are another two directions', function() {
        it('can embed examples', function() {
          assert.strictEqual(
            execute(
              '<!-- embed-examples: foo.js --><!-- embed-examples: bar.js -->',
              'my-module',
              '../index',
              examplesDirPath
            ),
            [
              "<!-- embed-examples: foo.js --><!-- embedded-example -->```",
              "const foo = require('my-module');",
              "```<!-- /embedded-example --><!-- embed-examples: bar.js --><!-- embedded-example -->```",
              "import bar from \"my-module\";",
              "```<!-- /embedded-example -->",
            ].join('\n')
          );
        });
      });
    });

    describe('Embedding failure', function() {
      describe('When there are no directions', function() {
        it('should not replace the text', function() {
          const text = '# h1'
          assert.strictEqual(execute(text, 'my-module', '../index.js', examplesDirPath), text);
        });
      });

      describe('When there are directions but the formats are incorrect', function() {
        describe('When "embed-examples:" does not exist', function() {
          it('should not replace the text', function() {
            const text = '<!-- foo.js -->';
            assert.strictEqual(execute(text, 'my-module', '../index.js', examplesDirPath), text);
          });
        });

        describe('When describing an example that does not exist', function() {
          it('should not replace the text', function() {
            const text = '<!-- embed-example: fooo.js -->';
            assert.strictEqual(execute(text, 'my-module', '../index.js', examplesDirPath), text);
          });
        });
      });
    });
  });
});
