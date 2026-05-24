"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Megaphone, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { WHATSAPP_ANNOUNCE_URL } from "@/lib/links";

const adSlides = [
  {
    kicker: "Vitrine para gearheads",
    title: "Anuncie seu turbo, swap ou projeto premium na TurboClass",
    cta: "Anunciar agora",
  },
  {
    kicker: "Compra qualificada",
    title: "Leads com perfil certo para carros preparados e exclusivos",
    cta: "Quero vender",
  },
  {
    kicker: "Curadoria TurboClass",
    title: "Fotos, setup, laudo e atendimento alinhados para converter melhor",
    cta: "Falar com especialista",
  },
];

export function TopBannerAd() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = adSlides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % adSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? adSlides.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % adSlides.length);
  }

  return (
    <aside className="top-banner-ad" aria-label="Carrossel de anuncios">
      <button type="button" className="ad-nav" onClick={goToPrevious} aria-label="Anuncio anterior">
        <ArrowLeft size={15} aria-hidden="true" />
      </button>

      <div className="ad-slide" aria-live="polite">
        <span className="ad-kicker">
          <Zap size={16} aria-hidden="true" />
          {activeSlide.kicker}
        </span>
        <strong>{activeSlide.title}</strong>
      </div>

      <Link href={WHATSAPP_ANNOUNCE_URL} className="ad-cta" target="_blank" rel="noreferrer">
        <Megaphone size={17} aria-hidden="true" />
        {activeSlide.cta}
        <ArrowRight size={17} aria-hidden="true" />
      </Link>

      <div className="ad-dots" aria-label="Selecionar anuncio">
        {adSlides.map((slide, index) => (
          <button
            key={slide.kicker}
            type="button"
            aria-label={`Ver anuncio ${index + 1}`}
            aria-current={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <button type="button" className="ad-nav" onClick={goToNext} aria-label="Proximo anuncio">
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </aside>
  );
}
