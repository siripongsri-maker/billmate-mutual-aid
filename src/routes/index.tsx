import { createFileRoute, redirect } from "@tanstack/react-router";

// The home page is now the standalone คนละนิด concept served from public/konlanid/.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/konlanid/index.html", reloadDocument: true });
  },
});
