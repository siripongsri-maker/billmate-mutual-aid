import { describe,it,expect } from 'vitest';
import { storyInputSchema,storyOutputSchema,hasPrivateIdentifiers } from './story-draft';
const valid={category:'ค่าไฟ',amount:1461.35,dueDate:'2026-11-01',situation:'รายได้ลดลงในช่วงนี้จึงยังจ่ายค่าไฟเดือนนี้ไม่ครบ',consent:true};
describe('story privacy boundary',()=>{
 it('requires explicit consent',()=>expect(storyInputSchema.safeParse({...valid,consent:false}).success).toBe(false));
 it.each(['0812345678','1-2345-67890-12-3','person@example.com','https://example.com','เลขบัญชี 1234567890'])('blocks identifier %s',v=>expect(storyInputSchema.safeParse({...valid,situation:valid.situation+' '+v}).success).toBe(false));
 it('keeps bill amount exactly',()=>expect(storyInputSchema.parse(valid).amount).toBe(1461.35));
 it('rejects output with personal contact details',()=>expect(storyOutputSchema.safeParse({title:'ค่าไฟ',story:'ติดต่อได้ที่ 0812345678'}).success).toBe(false));
 it('allows non-identifying situation',()=>expect(hasPrivateIdentifiers(valid.situation)).toBe(false));
});
