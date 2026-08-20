export const AUTH_ENDPOINTS = {
  LOGIN: "user/auth/login",
  REGISTER: "user/auth/register",
  LOGOUT: "user/auth/logout",
  SEND_OTP: "user/auth/otp",
  VERIFY_OTP: "user/auth/verify-otp",
  FORGOT_PASSWORD: "user/auth/forgot-password",
  RESET_PASSWORD: "user/auth/reset-password",
  // CHANGE_PASSWORD: "user/auth/change-password",
};
export const USER_ENDPOINTS = {
  PROFILE: "user/profile",
};
export const Blogs = {
  BLOG_CATEGORIES: "/blog-category",
  GET_ALL_BLOGS: "/blog",
  GET_ALL_BLOGS_BY_CATEGORY: (category_slug: string) => `/blog/category/${category_slug}`,
  GET_BLOG_DETAILS_BY_ID: (blogId: string) => `/blog/${blogId}`
}
export const Business = {
  BUSINESS_CATEGORIES: "/place-category/?type=place",
  GET_ALL_BUSINESS: "explore",
  GET_ALL_BUSINESS_BY_CATEGORIES_SLUG: (category_slug: string) => `/blog/category/${category_slug}`,
}