export const AUTH_ENDPOINTS = {
  LOGIN: "user/auth/login",
  REGISTER: "user/auth/register",
  LOGOUT: "user/auth/logout",
  VERIFY_EMAIL: "user/auth/verify-email",
  RESEND_VERIFICATION: "user/auth/resend-verification",
  FORGOT_PASSWORD: "user/auth/forgot-password",
  RESET_PASSWORD: "user/auth/reset-password",
  CHANGE_PASSWORD: "user/auth/change-password",
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
  CREATE_BUSINESS: "/business-submission",
  GET_ALL_BUSINESS: "explore",
  GET_BUSINESS_DETAILS_BY_SLUG: (slug: string) => `explore/listing/${slug}`,
}
export const Itineraries = {
  LIST: "/user/itineraries",
  DETAIL: (id: number | string) => `/user/itineraries/${id}`,
  ITEMS: (id: number | string) => `/user/itineraries/${id}/items`,
}
export const Rating = {
  ADD_TO_RATING: (id: number | string) => `explore/listing/${id}/reviews`,
  GET_ALL_RATING: (id: number | string) => `explore/listing/${id}/reviews`,
}
export const Place = {
  GET_ALL_PLACES: "/explore/places",
  GET_PLACE_DETAILS: (slug: string) => `/explore/places/${slug}`
}
