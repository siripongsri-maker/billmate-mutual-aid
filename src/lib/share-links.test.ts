import { describe,it,expect } from 'vitest';
import { shareInput,shareEvent,summarizeShares } from './share-links';
describe('channel share rules',()=>{
  it('only allows actual fictional bills',()=>{expect(shareInput.safeParse({kind:'bill',target_id:'b1',channel:'line'}).success).toBe(true);expect(shareInput.safeParse({kind:'bill',target_id:'missing',channel:'line'}).success).toBe(false);});
  it('does not permit a bill ID as circle',()=>expect(shareInput.safeParse({kind:'circle',target_id:'b1',channel:'line'}).success).toBe(false));
  it('accepts circle shares',()=>expect(shareInput.safeParse({kind:'circle',target_id:'c1',channel:'facebook'}).success).toBe(true));
  it('rejects personal data on events',()=>expect(shareEvent.safeParse({code:'a'.repeat(24),event:'open',email:'private@example.com'}).success).toBe(false));
  it('rejects visitor codes and raw URLs',()=>expect(shareEvent.safeParse({code:'https://example.com/private',event:'open'}).success).toBe(false));
  it('counts each channel separately and separates clicks from opens',()=>{
    const result=summarizeShares([{code:'a'.repeat(24),kind:'bill',target_id:'b1',channel:'line'},{code:'b'.repeat(24),kind:'bill',target_id:'b1',channel:'facebook'}],[{code:'a'.repeat(24),day:'2026-10-27',event:'open',count:10},{code:'a'.repeat(24),day:'2026-10-27',event:'help_click',count:2},{code:'b'.repeat(24),day:'2026-10-27',event:'open',count:3}]);
    expect(result[0]).toMatchObject({opens:10,help:2,joins:0});expect(result[1]).toMatchObject({opens:3,help:0});
  });
});