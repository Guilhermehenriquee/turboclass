import type { MetadataRoute } from "next";
import { inventory } from "@/data/inventory";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://turboclass.com.br";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/comprar`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    ...["vender", "financiamento", "sobre", "diferenciais", "contato"].map((route) => ({
      url: `${baseUrl}/${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...inventory.map((vehicle) => ({
      url: `${baseUrl}/comprar/${vehicle.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
