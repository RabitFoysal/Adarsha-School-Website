import { MetadataRoute } from "next";
import { getSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || "https://example.com";
  
  let data: any = null;
  try {
    data = await getSchoolData();
  } catch {}

  const lastModified = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/notices`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admission-info`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/academics`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fees-payment`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alumni`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/teachers`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/messages`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/committee`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/staff`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic routes from database: Teachers
  const teacherRoutes: MetadataRoute.Sitemap = (data?.teachers || []).map((teacher: any) => ({
    url: `${baseUrl}/teachers/${teacher.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic routes: Blogs
  const blogRoutes: MetadataRoute.Sitemap = (data?.blogs || []).map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic routes: Custom Pages
  const customPageRoutes: MetadataRoute.Sitemap = (data?.customPages || []).map((page: any) => ({
    url: `${baseUrl}/custom-pages/${page.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...teacherRoutes,
    ...blogRoutes,
    ...customPageRoutes,
  ];
}
