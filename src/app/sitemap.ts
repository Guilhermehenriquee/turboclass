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
      url: `${baseUrl}/estoque`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    ...inventory.map((vehicle) => ({
      url: `${baseUrl}/estoque/${vehicle.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
