import { describe, expect, it } from 'vitest';
import matrix from '@/docs/truth/AUTH-MATRIX.json';

const REQUIRED_PERSONAS = ['anon', 'owner', 'provider_owner', 'other_provider', 'admin', 'suspended'] as const;
const REQUIRED_GROUPS = [
  'admin',
  'payments',
  'booking_requests',
  'uploads',
  'notifications',
  'lost_pets_relay',
] as const;

describe('AUTH-MATRIX baseline', () => {
  it('covers all required personas from KIT-B auth matrix', () => {
    expect(matrix.personas).toEqual(expect.arrayContaining([...REQUIRED_PERSONAS]));
  });

  it('covers all required critical route groups', () => {
    const groups = matrix.routes.map(route => route.group);
    expect(groups).toEqual(expect.arrayContaining([...REQUIRED_GROUPS]));
  });

  it('defines expectations for every persona in every route group', () => {
    for (const route of matrix.routes) {
      expect(route.samples.length, `${route.group} must include sample routes`).toBeGreaterThan(0);
      expect(route.guard, `${route.group} must name its guard`).toBeTruthy();

      for (const persona of REQUIRED_PERSONAS) {
        expect(route.expected[persona], `${route.group} missing ${persona} expectation`).toBeTruthy();
      }
    }
  });

  it('keeps admin access explicitly DB-backed', () => {
    const adminRoutes = matrix.routes.filter(route =>
      ['admin', 'uploads', 'notifications'].includes(route.group)
    );

    for (const route of adminRoutes) {
      expect(route.expected.admin).toContain('db-profile_roles-admin');
    }
  });

  it('keeps payments disabled in the current launch baseline', () => {
    const payments = matrix.routes.find(route => route.group === 'payments');
    expect(payments).toBeDefined();
    for (const persona of REQUIRED_PERSONAS) {
      expect(payments?.expected[persona]).toBe('deny:503-payments-disabled-first');
    }
  });
});
