import type { Metadata } from "next";
import BlogExperience from "@/components/blog/BlogExperience";
import BlogNewsletter from "@/components/blog/BlogNewsletter";

export const metadata: Metadata = {
  title: "From Our Blog — The Marco Passport",
  description:
    "Travel tips, food guides, things to do and local know-how for Marco Island, Florida.",
  openGraph: {
    title: "From Our Blog — The Marco Passport",
    description:
      "Blogs, tips and guides to help you explore Marco Island like an insider.",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogExperience />
      <BlogNewsletter />
    </>
  );
}
