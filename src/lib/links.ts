export const WHATSAPP_ANNOUNCE_URL =
  "https://api.whatsapp.com/send?phone=5511988835101&text=Ol%C3%A1,%20gostaria%20de%20informa%C3%A7%C3%B5es%20para%20anunciar%20na%20TurboClass";

export const INSTAGRAM_URL = "https://www.instagram.com/turboclass.com.br/";

const WHATSAPP_PHONE = "5511988835101";

export function makeWhatsAppUrl(message: string) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}

export function makeVehicleInterestUrl(vehicleName: string, slug: string) {
  return makeWhatsAppUrl(
    `Ola, vi este veiculo na TurboClass e tenho interesse: ${vehicleName} - https://turboclass.com.br/comprar/${slug}. Ainda esta disponivel?`,
  );
}

export const WHATSAPP_SELL_URL = makeWhatsAppUrl(
  "Ola, quero anunciar meu carro na TurboClass e gostaria de saber como funciona.",
);

export const WHATSAPP_FINANCE_URL = makeWhatsAppUrl(
  "Ola, quero simular financiamento de um veiculo anunciado na TurboClass.",
);
