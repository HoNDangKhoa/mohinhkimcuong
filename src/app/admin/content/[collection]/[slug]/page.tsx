import { notFound } from "next/navigation";
import AdminFormPage from "@/components/admin/AdminFormPage";
import { getCollectionRecords, listCategories } from "@/lib/cms-local-store";
import type { CollectionKey } from "@/lib/cms-records";

const KEYS: CollectionKey[] = ["projects", "services", "articles", "pages"];

export const dynamic = "force-dynamic";

export default async function AdminRecordPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;
  if (!KEYS.includes(collection as CollectionKey)) notFound();
  const key = collection as CollectionKey;
  const categories = await listCategories();
  if (slug === "new") return <AdminFormPage collection={key} isNew categories={categories} />;

  const record = (await getCollectionRecords(key)).find((item) => item.slug === slug);
  if (!record) notFound();
  return <AdminFormPage collection={key} initial={record} categories={categories} />;
}
