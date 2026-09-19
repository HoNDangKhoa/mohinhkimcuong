import { buildFallbackLlmsTxt, fetchCmsSeoText } from "@/lib/cms-seo";

export const revalidate = 3600;

export async function GET() {
  const body = (await fetchCmsSeoText("/api/seo/llms.txt")) || buildFallbackLlmsTxt();

  return new Response(`${body.trim()}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
