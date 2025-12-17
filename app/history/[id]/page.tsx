import HistoryDetailClient from "./history-detail-client";

export default function HistoryDetailPage({ params }: { params: { id: string } }) {
    return <HistoryDetailClient listId={params.id} />;
}
