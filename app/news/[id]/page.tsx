import { notFound } from "next/navigation";
import NewsDetail from "@/components/news/NewsDetail";
import { getNewsById } from "@/lib/news";

type NewsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const newsId = parseInt(id, 10);
  const news = getNewsById(newsId);

  if (!news) {
    notFound();
  }

  return <NewsDetail news={news} />;
}

