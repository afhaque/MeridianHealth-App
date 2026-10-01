import { getSnapshot } from "@/lib/snapshots";
import SharedView from "./SharedView";

export default async function SharedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snapshot = await getSnapshot(id);
  if (!snapshot) return <SharedView deals={[]} label="" error="Snapshot not found." />;
  return <SharedView deals={snapshot.data} label={snapshot.label || "Shared Snapshot"} error="" />;
}
