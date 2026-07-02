import { describe, expect, it } from 'vitest';
import {
  bookingConfirmationEmailSchema,
  pushSendSchema,
  reviewRequestEmailSchema,
  smsSendSchema,
  uploadMetadataSchema,
  verificationUploadMetadataSchema,
} from './schemas';

const userId = '11111111-1111-4111-8111-111111111111';
const bookingId = '22222222-2222-4222-8222-222222222222';

describe('security P0 validation schemas', () => {
  it('rejects invalid sms payloads', () => {
    expect(smsSendSchema.safeParse({ to: '+38591123456' }).success).toBe(false);
    expect(smsSendSchema.safeParse({ to: '+38591123456', body: 'Bok' }).success).toBe(true);
  });

  it('validates transactional email payloads', () => {
    expect(bookingConfirmationEmailSchema.safeParse({ userId, petName: 'Rex', serviceName: 'Šetnja', dates: 'sutra' }).success).toBe(true);
    expect(reviewRequestEmailSchema.safeParse({ userId, petName: 'Rex', bookingId }).success).toBe(true);
    expect(reviewRequestEmailSchema.safeParse({ userId: 'nope', petName: 'Rex', bookingId }).success).toBe(false);
  });

  it('rejects malformed push payloads', () => {
    expect(pushSendSchema.safeParse({ userIds: [], payload: { title: 'A', body: 'B' } }).success).toBe(false);
    expect(pushSendSchema.safeParse({ userIds: [userId], payload: { title: 'A', body: 'B' } }).success).toBe(true);
  });

  it('rejects unsafe upload metadata paths', () => {
    expect(uploadMetadataSchema.safeParse({ bucket: 'pet-photos', folder: 'users/gallery' }).success).toBe(true);
    expect(uploadMetadataSchema.safeParse({ bucket: 'pet-photos', folder: '../secret' }).success).toBe(false);
    expect(verificationUploadMetadataSchema.safeParse({ document_type: 'id_document', folder: 'verification' }).success).toBe(true);
  });
});
