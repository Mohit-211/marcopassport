import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticleExperience from "@/components/blog/BlogArticleExperience";
import { GetBlogDetailsByIdApi } from "@/api/users/blog.api";
import { isNotFoundError } from "@/errors/apiError";
import type { Blog } from "@/types/blog";

type Props = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

/**
 * The blog, or null when the API says there's no such post (the page then
 * answers 404). Any other failure throws, so it reaches the error page.
 */
async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const res = await GetBlogDetailsByIdApi(id);
    return res?.data?.data ?? null;
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogById(id);
  if (!post) {
    return {
      title: "Blog — The Marco Passport",
    };
  }
  const imageUrl = post.featured_image
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${post.featured_image}`
    : undefined;
  return {
    title: `${post.title} — The Marco Passport`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogById(id);
  if (!post) notFound();
  return <BlogArticleExperience post={post} />;
}
