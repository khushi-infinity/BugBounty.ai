/**
 * Autonomous Fix by BugBounty.ai
 * Issue: ISSUE-7792 - Race condition in useEffect due to missing async cleanup
 * Checkpoint: chk_ent_mv5dfw8r_yfmv
 * Timestamp: 2026-10-12T14:52:57.856Z
 */

// --- VERIFIED CODE PATCH ---
import { useState, useEffect } from 'react';

function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchUser(userId)
      .then((data) => {
        if (isCurrent) {
          setProfile(data);
        }
      })
      .catch((error) => {
        if (isCurrent) {
          console.error('Failed to fetch user profile:', error);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [userId]);

  return profile;
}

// --- VERIFICATION TEST CASE ---
import { renderHook, act } from '@testing-library/react';
import { useUserProfile } from './useUserProfile';
import { fetchUser } from './api';

jest.mock('./api');

test('discards stale responses when userId updates quickly', async () => {
  let resolveFirst;
  let resolveSecond;

  fetchUser.mockImplementation((id) => {
    if (id === '1') {
      return new Promise(res => { resolveFirst = res; });
    }
    return new Promise(res => { resolveSecond = res; });
  });

  const { result, rerender } = renderHook(({ id }) => useUserProfile(id), {
    initialProps: { id: '1' }
  });

  rerender({ id: '2' });

  await act(async () => {
    resolveSecond({ id: '2', name: 'User Two' });
  });
  expect(result.current).toEqual({ id: '2', name: 'User Two' });

  await act(async () => {
    resolveFirst({ id: '1', name: 'User One' });
  });
  expect(result.current).toEqual({ id: '2', name: 'User Two' });
});
