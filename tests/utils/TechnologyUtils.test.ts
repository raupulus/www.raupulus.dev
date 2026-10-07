import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTechnologyBySlug } from '~/utils/TechnologyUtils';

describe('TechnologyUtils', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
    });

    it('getTechnologyBySlug devuelve undefined si no hay datos de tecnologías', () => {
        const result = getTechnologyBySlug('non-existent-technology-slug');
        expect(result).toBeUndefined();
    });
});
