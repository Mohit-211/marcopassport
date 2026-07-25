import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBlogBySlug, getRelatedBlogs } from "@/data/blogs";
import BlogArticleExperience from "@/components/blog/BlogArticleExperience";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return { title: "Story — Marco Passport" };
  }

  return {
    title: `${post.title} — Marco Passport`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-5 lg:px-8 py-32 text-center">
        <h1 className="font-display text-4xl text-primary">Story not found</h1>
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

  const related = getRelatedBlogs(post.slug, 3);

  return <BlogArticleExperience post={post} related={related} />;
}
