import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BlogArticleExperience from "@/components/blog/BlogArticleExperience";
import { GetBlogDetailsByIdApi } from "@/api/users/blog.api";
import type { Blog } from "@/types/blog";

type Props = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const res = await GetBlogDetailsByIdApi(id);
    return res?.data?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogById(id);
  if (!post) {
    return {
      title: "Story — The Marco Passport",
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
  console.log(post,"post")
  if (!post) {
    return (
      <div className="container mx-auto px-5 lg:px-8 py-32 text-center">
        <h1 className="font-display text-4xl text-primary">
          Story not found
        </h1>
        <p className="text-muted-foreground mt-3">
          The article you're looking for may have been moved.
        </p>
        <Link href="/blog" className="inline-block mt-6">
          <Button className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">
            Back to the blog
          </Button>
        </Link>
      </div>
    );
  }
  return <BlogArticleExperience post={post} related={[]} />;
}
