import { createFileRoute, redirect } from "@tanstack/react-router";
import { pageTitle } from '@/lib/brand';

// The home page is now the standalone คนละนิด concept served from public/konlanid/.
export const Route = createFileRoute("/")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{title:pageTitle('แบ่งเบาบิล','th')},{name:'description',content:'ต้นแบบการช่วยแบ่งเบาบิล ไม่มีการรับเงินจริง'},{property:'og:title',content:pageTitle('แบ่งเบาบิล','th')},{property:'og:description',content:'ต้นแบบการช่วยแบ่งเบาบิลอย่างคำนึงถึงความเป็นส่วนตัว'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}] }),
  beforeLoad: () => {
    throw redirect({ href: "/konlanid/index.html", reloadDocument: true });
  },
});
