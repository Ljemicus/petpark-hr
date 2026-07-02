import { describe, expect, it } from 'vitest';
import {
  DOCUMENT_MIME_TYPES,
  IMAGE_MIME_TYPES,
  detectMimeFromSignature,
  validateUploadSignature,
} from './file-signature';

describe('file signature validation', () => {
  it('detects jpeg/png/webp/pdf signatures', () => {
    expect(detectMimeFromSignature(Buffer.from([0xff, 0xd8, 0xff, 0x00]))).toBe('image/jpeg');
    expect(detectMimeFromSignature(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('image/png');
    expect(detectMimeFromSignature(Buffer.from('RIFFxxxxWEBPpayload'))).toBe('image/webp');
    expect(detectMimeFromSignature(Buffer.from('%PDF-1.7'))).toBe('application/pdf');
  });

  it('rejects extension/mime spoofing when content signature disagrees', () => {
    const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const result = validateUploadSignature(pngBytes, 'application/pdf', DOCUMENT_MIME_TYPES);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('INVALID_FILE_SIGNATURE');
    }
  });

  it('rejects pdf for image-only uploads', () => {
    const pdfBytes = Buffer.from('%PDF-1.7');
    const result = validateUploadSignature(pdfBytes, 'application/pdf', IMAGE_MIME_TYPES);

    expect(result.ok).toBe(false);
  });
});
