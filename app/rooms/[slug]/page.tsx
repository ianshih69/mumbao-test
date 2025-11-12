import { notFound } from "next/navigation";
import RoomDetail from "@/components/room/RoomDetail";
import { getRoomBySlug, getAllRooms } from "@/lib/room";

type RoomDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  return <RoomDetail room={room} />;
}

export async function generateStaticParams() {
  const rooms = getAllRooms();
  return rooms.map((r) => ({ slug: r.slug }));
}

