import { notFound } from "next/navigation";
import AdminListPage from "@/components/admin/AdminListPage";
import { getCollectionRecords } from "@/lib/cms-local-store";
import type { CollectionKey } from "@/lib/cms-records";

const KEYS: CollectionKey[] = ["projects", "services", "articles", "pages"];

export const dynamic = "force-dynamic";

export default async function AdminCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!KEYS.includes(collection as CollectionKey)) notFound();
  const key = collection as CollectionKey;
  return <AdminListPage collection={key} records={await getCollectionRecords(key)} />;
}
