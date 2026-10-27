import { describe, it, expect } from 'vitest';
import { trafficInput, trafficSummary, trafficDays } from './traffic';
import { normalizePage, classifySource } from '../../public/traffic.js';

describe('minimal traffic data', () => {
  it('rejects personal data fields', () => expect(trafficInput.safeParse({event:'page_view',page:'home',source:'direct',email:'person@example.com'}).success).toBe(false));
  it('rejects raw pages containing bill IDs', () => expect(trafficInput.safeParse({event:'bill_view',page:'/bill/123',source:'direct'}).success).toBe(false));
  it('rejects raw referrer URLs', () => expect(trafficInput.safeParse({event:'visit',page:'home',source:'https://example.com/private'}).success).toBe(false));
  it('excludes story drafting and contact pages', () => {expect(normalizePage('/draft-story')).toBeNull();expect(normalizePage('/contact')).toBeNull();expect(normalizePage('/admin/analytics')).toBeNull();});
  it('strips bill identifiers to categories', () => expect(normalizePage('/bill/private-id?email=x')).toBe('bill'));
  it('classifies external sources without paths or identifiers', () => expect(classifySource('https://www.facebook.com/private?token=secret','https://inidhelp.com')).toBe('facebook'));
  it('does not mistake a spoofed domain for Facebook', () => expect(classifySource('https://facebook.com.evil.test','https://inidhelp.com')).toBe('other'));
  it('sums clicks independently from views and never calculates money', () => expect(trafficSummary([{day:'2026-10-27',event:'bill_view',page:'bill',source:'direct',count:8},{day:'2026-10-27',event:'help_click',page:'bill',source:'direct',count:3}])).toMatchObject({billViews:8,helpClicks:3,views:0}));
  it('only permits retained reporting windows', () => {expect(trafficDays.safeParse(90).success).toBe(true);expect(trafficDays.safeParse(91).success).toBe(false);});
});