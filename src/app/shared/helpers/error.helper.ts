import { ERROR_TITLES } from '../../constants/error-message';

export const generateErrorMessage = (error: any) => {
  let errorMessage = '';
  if (error.status) {
    switch (error.status) {
      case 400:
        return 'The request was invalid. Please check your input.';
      case 401:
        return 'Please login to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data.';
      case 422:
        return 'Please check your input and try again.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
        return 'Something went wrong on our end. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  } else {
    errorMessage = 'An unexpected error occurred. Please try again.';
  }

  return errorMessage;
};

export const generateErrorTitle = (statusCode: number) => {
  return ERROR_TITLES[statusCode];
};
