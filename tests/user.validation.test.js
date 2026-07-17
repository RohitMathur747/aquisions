import test from 'node:test';
import assert from 'node:assert/strict';

import {
  updateUserSchema,
  userIdSchema,
} from '../src/Validations/users.validation.js';

test('updateUserSchema accepts valid user updates', () => {
  const result = updateUserSchema.safeParse({
    name: 'Updated Name',
    email: 'updated@example.com',
    role: 'admin',
  });

  assert.equal(result.success, true);
});

test('updateUserSchema rejects invalid role values', () => {
  const result = updateUserSchema.safeParse({ role: 'superadmin' });

  assert.equal(result.success, false);
});

test('userIdSchema parses numeric route ids', () => {
  const result = userIdSchema.safeParse({ id: '42' });

  assert.equal(result.success, true);
  assert.equal(result.data.id, 42);
});
