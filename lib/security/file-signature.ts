export type SupportedUploadMime = 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf';

export const IMAGE_MIME_TYPES = new Set<SupportedUploadMime>(['image/jpeg', 'image/png', 'image/webp']);
export const DOCUMENT_MIME_TYPES = new Set<SupportedUploadMime>(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;

function bytesStartWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;
  return signature.every((value, index) => bytes[index] === value);
}

export function detectMimeFromSignature(buffer: Buffer): SupportedUploadMime | null {
  const bytes = new Uint8Array(buffer);

  if (bytesStartWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (bytesStartWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (
    bytes.length >= 12 &&
    bytesStartWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  if (bytesStartWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf';

  return null;
}

export function isSupportedUploadMime(value: string): value is SupportedUploadMime {
  return DOCUMENT_MIME_TYPES.has(value as SupportedUploadMime);
}

export function validateUploadSignature(buffer: Buffer, declaredMime: string, allowedTypes: Set<SupportedUploadMime>) {
  if (!isSupportedUploadMime(declaredMime) || !allowedTypes.has(declaredMime)) {
    return { ok: false as const, code: 'INVALID_FILE_TYPE', message: 'Neispravan format datoteke.' };
  }

  const detectedMime = detectMimeFromSignature(buffer);
  if (!detectedMime || detectedMime !== declaredMime || !allowedTypes.has(detectedMime)) {
    return { ok: false as const, code: 'INVALID_FILE_SIGNATURE', message: 'Neispravan format datoteke.' };
  }

  return { ok: true as const, mime: detectedMime };
}

export function getUploadSizeLimit(allowedTypes: Set<SupportedUploadMime>): number {
  return allowedTypes.has('application/pdf') ? MAX_DOCUMENT_BYTES : MAX_IMAGE_BYTES;
}
