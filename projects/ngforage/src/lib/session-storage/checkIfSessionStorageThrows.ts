/**
 * Check if sessionStorage throws when saving an item
 * @internal
 */
export function checkIfSessionStorageThrows(): boolean {
  const testKey = '_localforage_support_test';

  try {
    sessionStorage.setItem(testKey, '1');
    sessionStorage.removeItem(testKey);

    return false;
  } catch (e) {
    return true;
  }
}
