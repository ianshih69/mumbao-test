import Image from "next/image";
import type { NewsItem } from "@/lib/news";

type NewsDetailProps = {
  news: NewsItem;
};

export default function NewsDetail({ news }: NewsDetailProps) {
  return (
    <div className="news-detail">
      <div className="news-detail-image">
        <Image
          src={news.image}
          alt={news.name}
          width={314}
          height={367}
          className="object-cover"
          priority
        />
      </div>
      <div className="news-detail-content">
        <h1 className="news-detail-title">{news.title}</h1>
        <div className="news-detail-date">{news.date}</div>
      </div>
    </div>
  );
}

