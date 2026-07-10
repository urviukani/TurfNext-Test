export default function sitemap() {
  const siteUrl = "https://turfnext.com";
  const routes = ["", "/player", "/owner"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
