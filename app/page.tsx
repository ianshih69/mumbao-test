import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import NewsList from "@/components/news/NewsList";
import RoomList from "@/components/room/RoomList";
import Booking from "@/components/booking/Booking";
import Footer from "@/components/footer/Footer";

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <NewsList />
      <RoomList />
      <Booking />
      <Footer />
    </>
  );
}
