import client from "../client";
import { Blogs } from "../endpoints";

export const GetBlogCategoryApi = () =>
    client.get(Blogs.BLOG_CATEGORIES);

export const GetAllBlogsApi = () =>
    client.get(Blogs.GET_ALL_BLOGS);

export const GetAllBlogsByCategoryApi = (categorySlug: string) =>
    client.get(Blogs.GET_ALL_BLOGS_BY_CATEGORY(categorySlug));

export const GetBlogDetailsByIdApi = (blogId: string) =>
    client.get(Blogs.GET_BLOG_DETAILS_BY_ID(blogId));