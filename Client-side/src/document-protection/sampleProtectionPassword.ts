/**
 * Demonstration-only document protection password.
 *
 * This value is NOT an authorization secret. It only exercises the Document
 * Editor restrict-editing API. Production applications must not expose a
 * master protection password in client source, public configuration, or
 * repository history.
 */
export const SAMPLE_PROTECTION_PASSWORD = 'SampleOnly-NotForProduction';
