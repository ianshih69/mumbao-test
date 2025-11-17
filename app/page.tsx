"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import NewsList from "@/components/news/NewsList";
import RoomList from "@/components/room/RoomList";
import Booking from "@/components/booking/Booking";
import Footer from "@/components/footer/Footer";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  // 確保只在客戶端 hydration 完成後才渲染內容，避免 SSR/CSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在 hydration 完成前渲染佔位符，避免從 null 到有內容的跳動
  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#eed3b2" }} />
    );
  }

  return (
    <>
      <Header />
      <Hero />
      <About />
      <NewsList />
      <RoomList />
      <Booking />
      <Footer />
    </>
  );
}
