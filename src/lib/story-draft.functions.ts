import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { storyInputSchema, storyOutputSchema, storyInstructions } from './story-draft';
export const draftStory = createServerFn({ method: 'POST' })
 .middleware([requireSupabaseAuth])
 .inputValidator((input: unknown) => storyInputSchema.parse(input))
 .handler(async ({ data }) => {
  const { generateResponse, GatewayError } = await import('@lovable.dev/ai-gateway');
  const { setResponseHeader } = await import('@tanstack/react-start/server');
  setResponseHeader('Cache-Control','no-store');
  try {
   const response = await generateResponse({model:'openai/gpt-6-astra',instructions:storyInstructions,
    input:[{role:'user',content:JSON.stringify({category:data.category,amount:data.amount,dueDate:data.dueDate,situation:data.situation})}],
    reasoning:{effort:'low'},text:{format:{type:'json_schema',name:'private_story',strict:true,schema:{type:'object',properties:{title:{type:'string'},story:{type:'string'}},required:['title','story'],additionalProperties:false}}}});
   const text = response.output.flatMap(item => item.type === 'message' ? item.content.flatMap(part => part.type === 'output_text' ? [part.text] : []) : []).join('');
   const parsed = storyOutputSchema.safeParse(JSON.parse(text));
   if (!parsed.success) return {ok:false as const,message:'ร่างยังไม่ผ่านการตรวจความเป็นส่วนตัว กรุณาปรับรายละเอียดก่อนลองใหม่'};
   return {ok:true as const,draft:parsed.data};
  } catch(error) {
   if(error instanceof GatewayError) {
    console.warn('Story drafting failed',{code:error.code,status:error.httpStatus});
    return {ok:false as const,message:error.httpStatus===402?'เครดิต AI ไม่เพียงพอ กรุณาแจ้งผู้ดูแล':error.httpStatus===429?'AI กำลังมีผู้ใช้มาก รอสักครู่ก่อนลองใหม่':'AI ยังร่างให้ไม่ได้ ข้อมูลของคุณยังอยู่ กรุณาลองใหม่เมื่อพร้อม'};
   }
   return {ok:false as const,message:'ยังอ่านร่างจาก AI ไม่ได้ ข้อมูลของคุณยังอยู่ กรุณาตรวจรายละเอียดก่อนลองใหม่'};
  }
 });
