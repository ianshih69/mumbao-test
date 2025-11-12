import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import NewsList from "@/components/news/NewsList";
import RoomList from "@/components/room/RoomList";
import Booking from "@/components/booking/Booking";

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <NewsList />
      <RoomList />
      <Booking />
    </>
  );
}
