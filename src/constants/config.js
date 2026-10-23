const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL,

  // 15 s: long enough for a slow API, short enough that a stalled one shows
  // the page's fallback instead of hanging it.
  TIMEOUT: 15000,
};

export default config;
