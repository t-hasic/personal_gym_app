import test from 'node:test';
import assert from 'node:assert/strict';
import {availableUpdate,refreshUrl} from './update-check.js';
test('update check bypasses cache and detects a different deployed version', async () => {
  const fetcher = async (url, options) => {
    assert.match(url, /^\/personal_gym_app\/version.json\?check=\d+$/);
    assert.equal(options.cache, 'no-store');
    return {ok:true,json:async()=>({version:'new'})};
  };
  assert.equal(await availableUpdate('/personal_gym_app/', 'old', fetcher), 'new');
  assert.equal(await availableUpdate('/personal_gym_app/', 'new', fetcher), null);
});
test('failed or malformed checks do not offer an update', async () => {
  await assert.rejects(availableUpdate('/', 'old', async()=>({ok:false})));
  await assert.rejects(availableUpdate('/', 'old', async()=>({ok:true,json:async()=>({})})));
});
test('refresh preserves the app path and other query parameters', () => {
  const url = new URL(refreshUrl('https://example.com/personal_gym_app/?a=1&refresh=old#log'));
  assert.equal(url.pathname, '/personal_gym_app/');
  assert.equal(url.searchParams.get('a'),'1');
  assert.match(url.searchParams.get('refresh'),/^\d+$/);
  assert.equal(url.hash,'#log');
});
