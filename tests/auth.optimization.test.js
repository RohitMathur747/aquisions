import test from 'node:test';
import assert from 'node:assert/strict';

import { cookies } from '../src/Utils/cookies.js';
import { signupSchema } from '../src/Validations/auth.validations.js';

test('cookies.set uses res.cookie with the expected arguments', () => {
  const calls = [];
  const res = {
    cookie: (...args) => calls.push(args),
  };

  cookies.set(res, 'token', 'abc123');

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'token');
  assert.equal(calls[0][1], 'abc123');
  assert.equal(calls[0][2].httpOnly, true);
  assert.equal(calls[0][2].maxAge, 15 * 60 * 1000);
});

test('signupSchema rejects malformed emails', () => {
  const result = signupSchema.safeParse({
    name: 'Test User',
    email: 'not-an-email',
    password: 'secret123',
    role: 'user',
  });

  assert.equal(result.success, false);
});
