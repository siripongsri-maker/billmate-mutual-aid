export type L = { th: string; en: string };
export type Category = "medical" | "utility" | "education" | "rent" | "funeral" | "disaster";

export const categories: { id: Category; icon: string; label: L }[] = [
  { id: "medical", icon: "🩺", label: { th: "ค่ารักษา", en: "Medical" } },
  { id: "utility", icon: "💡", label: { th: "ค่าน้ำไฟ", en: "Utilities" } },
  { id: "education", icon: "🎒", label: { th: "การศึกษา", en: "Education" } },
  { id: "rent", icon: "🏠", label: { th: "ค่าเช่า", en: "Rent" } },
  { id: "funeral", icon: "🕯️", label: { th: "งานศพ", en: "Funeral" } },
  { id: "disaster", icon: "🌊", label: { th: "ภัยพิบัติ", en: "Disaster" } },
];

export type Bill = {
  id: string;
  title: L;
  name: string; // pseudonym
  region: L;
  category: Category;
  goal: number;
  raised: number;
  givers: number;
  dueDays: number;
  verified: boolean;
  urgent?: boolean;
  story: L;
  biller: L;
  updates: { day: string; text: L }[];
};

export const bills: Bill[] = [
  {
    id: "b1", name: "แม่ลำดวน (นามสมมติ)", category: "medical", goal: 8400, raised: 6120, givers: 87, dueDays: 4, verified: true, urgent: true,
    title: { th: "ค่ายาเบาหวานรายเดือนของแม่", en: "Mom's monthly diabetes medication" },
    region: { th: "ภาคอีสาน", en: "Northeast" },
    biller: { th: "โรงพยาบาลชุมชน (ตัวอย่าง)", en: "Community hospital (sample)" },
    story: { th: "ลูกสาวคนเดียวที่ดูแลแม่ เพิ่งถูกลดชั่วโมงงาน ค่ายาอินซูลินเดือนนี้เกินงบ ขอแรงช่วยเพียงเดือนนี้ค่ะ", en: "I'm the only daughter caring for my mom and my hours were just cut. This month's insulin is over budget — asking for help just this month." },
    updates: [{ day: "2", text: { th: "ผู้ตรวจสอบยืนยันใบแจ้งหนี้แล้ว (เดโม)", en: "Moderator reviewed the bill (demo)" } }],
  },
  {
    id: "b2", name: "ครอบครัวสมใจ (นามสมมติ)", category: "utility", goal: 2350, raised: 1890, givers: 42, dueDays: 2, verified: true, urgent: true,
    title: { th: "ค่าไฟค้างชำระ 2 เดือน", en: "Two months of overdue electricity" },
    region: { th: "กรุงเทพฯ", en: "Bangkok" },
    biller: { th: "การไฟฟ้า (ตัวอย่าง)", en: "Electric utility (sample)" },
    story: { th: "ลูกเล็กสองคนต้องใช้พัดลมช่วงหน้าร้อน หลังตกงานเราค้างค่าไฟ อยากเคลียร์ก่อนถูกตัดไฟ", en: "Two small kids need fans in the heat. After losing my job we fell behind and want to clear it before disconnection." },
    updates: [],
  },
  {
    id: "b3", name: "น้องต้นกล้า (นามสมมติ)", category: "education", goal: 5600, raised: 1400, givers: 19, dueDays: 12, verified: true,
    title: { th: "ค่าเทอมและชุดนักเรียน ม.1", en: "Grade 7 tuition & uniforms" },
    region: { th: "ภาคเหนือ", en: "North" },
    biller: { th: "โรงเรียนประจำจังหวัด (ตัวอย่าง)", en: "Provincial school (sample)" },
    story: { th: "ยายเลี้ยงหลานมาตั้งแต่เด็ก ปีนี้น้องสอบเข้าโรงเรียนในเมืองได้ ค่าแรกเข้าสูงกว่าที่เก็บไว้", en: "Grandma has raised him since childhood. He got into a city school this year, and the entry fees exceed her savings." },
    updates: [],
  },
  {
    id: "b4", name: "พี่วิทย์ (นามสมมติ)", category: "rent", goal: 4500, raised: 4500, givers: 63, dueDays: 0, verified: true,
    title: { th: "ค่าเช่าห้องหลังผ่าตัดเข่า", en: "Rent after knee surgery" },
    region: { th: "ภาคตะวันออก", en: "East" },
    biller: { th: "เจ้าของห้องเช่า (ตัวอย่าง)", en: "Landlord (sample)" },
    story: { th: "ไรเดอร์ส่งอาหาร ผ่าตัดเข่าทำงานไม่ได้ 6 สัปดาห์", en: "A food delivery rider who can't work for 6 weeks after knee surgery." },
    updates: [{ day: "1", text: { th: "ครบเป้าแล้ว ขอบคุณทุกคน! (เดโม)", en: "Fully funded — thank you all! (demo)" } }],
  },
  {
    id: "b5", name: "ชุมชนริมน้ำ (นามสมมติ)", category: "disaster", goal: 12000, raised: 3300, givers: 51, dueDays: 9, verified: true,
    title: { th: "ซ่อมเครื่องสูบน้ำหลังน้ำท่วม", en: "Water pump repair after flooding" },
    region: { th: "ภาคกลาง", en: "Central" },
    biller: { th: "ร้านซ่อมเครื่องจักร (ตัวอย่าง)", en: "Machinery repair shop (sample)" },
    story: { th: "เครื่องสูบน้ำส่วนกลางของชุมชน 30 ครัวเรือนเสียหายจากน้ำท่วม", en: "The shared pump serving 30 households was damaged in the flood." },
    updates: [],
  },
  {
    id: "b6", name: "คุณนิด (นามสมมติ)", category: "funeral", goal: 7000, raised: 2100, givers: 24, dueDays: 6, verified: false,
    title: { th: "ค่าจัดงานศพพ่อแบบเรียบง่าย", en: "A simple funeral for my father" },
    region: { th: "ภาคใต้", en: "South" },
    biller: { th: "วัดในชุมชน (ตัวอย่าง)", en: "Local temple (sample)" },
    story: { th: "พ่อจากไปกะทันหัน อยากจัดงานเล็กๆ ให้ท่านอย่างสมเกียรติ", en: "Dad passed suddenly. I want a small, dignified ceremony for him." },
    updates: [],
  },
];

export type Circle = { id: string; name: L; desc: L; members: number; pool: number; emoji: string; focus: Category };
export const circles: Circle[] = [
  { id: "c1", emoji: "🛵", focus: "medical", members: 1240, pool: 48200, name: { th: "วงไรเดอร์ช่วยไรเดอร์", en: "Riders for Riders" }, desc: { th: "ไรเดอร์ส่งของช่วยกันเรื่องค่ารักษาและอุบัติเหตุ", en: "Delivery riders covering each other's medical & accident bills" } },
  { id: "c2", emoji: "👩‍🏫", focus: "education", members: 860, pool: 31500, name: { th: "ครูช่วยศิษย์", en: "Teachers for Students" }, desc: { th: "ค่าเทอม อุปกรณ์ และค่าเดินทางของนักเรียน", en: "Tuition, supplies and transport for students" } },
  { id: "c3", emoji: "🏘️", focus: "utility", members: 2310, pool: 66800, name: { th: "เพื่อนบ้านคลองเตย (สมมติ)", en: "Klong Toey Neighbours (fictional)" }, desc: { th: "ค่าน้ำไฟและค่าเช่าในชุมชน", en: "Utilities and rent within the community" } },
  { id: "c4", emoji: "🌾", focus: "disaster", members: 540, pool: 19700, name: { th: "เครือข่ายเกษตรกรรับมือภัย", en: "Farmers' Resilience Network" }, desc: { th: "รับมือน้ำท่วม ภัยแล้ง และความเสียหายพืชผล", en: "Floods, drought and crop loss" } },
];

export const fmt = (n: number) => "฿" + n.toLocaleString("en-US");
