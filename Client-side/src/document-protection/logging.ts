export function logPermissionDecision(
  userId: string,
  identity: string,
  grantedBookmarks: string[],
  missingBookmarks: string[],
): void {
  console.info('permission-decision', {
    userId,
    identity,
    grantedBookmarkCount: grantedBookmarks.length,
    grantedBookmarks,
    missingBookmarkCount: missingBookmarks.length,
    missingBookmarks,
  });
}

export function logFailure(stage: string, userId?: string): void {
  console.error('permission-flow-failed', { stage, userId });
}
