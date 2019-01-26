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
            execute('<!-- embed-examples: foo.js -->', examplesDirPath, []),
            [
              "<!-- embed-examples: foo.js --><!-- embedded-example -->```",
              "const foo = require('../index');",
              "```<!-- /embedded-example -->",
            ].join('\n')
          );
        });

        it('should not change when replacing continuously', function() {
          const first = execute('<!-- embed-examples: foo.js -->', examplesDirPath, []);
          const second = execute(first, examplesDirPath, []);
          assert.strictEqual(first, second);
        });

        it('can replace keywords', function() {
          assert.strictEqual(
            execute(
              '<!-- embed-examples: foo.js -->',
              examplesDirPath,
              [{from: '../index', to: 'foo'}]
            ),
            [
              "<!-- embed-examples: foo.js --><!-- embedded-example -->```",
              "const foo = require('foo');",
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
              examplesDirPath,
              []
            ),
            [
              "<!-- embed-examples: foo.js --><!-- embedded-example -->```",
              "const foo = require('../index');",
              "```<!-- /embedded-example --><!-- embed-examples: bar.js --><!-- embedded-example -->```",
              "import bar from \"../index\";",
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
          assert.strictEqual(execute(text, examplesDirPath, []), text);
        });
      });

      describe('When there are directions but the formats are incorrect', function() {
        describe('When "embed-examples:" does not exist', function() {
          it('should not replace the text', function() {
            const text = '<!-- foo.js -->';
            assert.strictEqual(execute(text, examplesDirPath, []), text);
          });
        });

        describe('When describing an example that does not exist', function() {
          it('should not replace the text', function() {
            const text = '<!-- embed-example: fooo.js -->';
            assert.strictEqual(execute(text, examplesDirPath, []), text);
          });
        });
      });
    });
  });
});
