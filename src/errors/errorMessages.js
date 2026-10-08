const errorMessages = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  UNKNOWN: "Something went wrong. Please try again.",
  LOGIN_REQUIRED: "Please sign in to continue.",
};

// Fallbacks used when the backend response carries no usable message.
export const statusMessages = {
  400: "Please check your request and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action could not be completed because of a conflict.",
  422: "Please check the entered information.",
  429: "Too many requests. Please try again later.",
  500: "Something went wrong on the server. Please try again later.",
  502: "Service is temporarily unavailable. Please try again later.",
  503: "Service is temporarily unavailable. Please try again later.",
  504: "Service is temporarily unavailable. Please try again later.",
};

export default errorMessages;
