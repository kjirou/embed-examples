import * as assert from 'assert';
import {describe, it} from 'mocha';

import {dummy} from '../src/index';

describe('dummy', function() {
  it('returns 1', function() {
    assert.strictEqual(dummy(), 1);
  });
});
