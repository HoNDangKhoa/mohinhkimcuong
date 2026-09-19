import { revalidatePath } from "next/cache";

export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/du-an", "layout");
  revalidatePath("/dich-vu", "layout");
  revalidatePath("/tin-tuc", "layout");
  revalidatePath("/gioi-thieu");
  revalidatePath("/lien-he");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
  revalidatePath("/admin", "layout");
}
