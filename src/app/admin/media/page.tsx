import MediaDropzoneClient from "@/components/admin/MediaLibraryClient";
import { listMedia } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const items = await listMedia();
  return <MediaDropzoneClient items={items} />;
}
