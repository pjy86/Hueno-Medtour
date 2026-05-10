/**
 * Retired CMS keys: checkup packages use only checkup_package_N_{name|content}.
 * Frontend no longer reads _desc/_crowd/_highlight/_items.
 */
export const DEPRECATED_CHECKUP_PACKAGE_SPLIT_KEYS =
  /^checkup_package_\d+_(desc|crowd|highlight|items)$/

export function isDeprecatedCheckupPackageContentKey(key: string): boolean {
  return DEPRECATED_CHECKUP_PACKAGE_SPLIT_KEYS.test(key)
}
