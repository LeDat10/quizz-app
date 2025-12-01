export const ERROR_MESSAGES: Record<string, string> = {
  // Category errors
  CATEGORY_NOT_FOUND: 'Category not found. It may have been deleted.',
  CATEGORY_ALREADY_EXISTS: 'A category with this name already exists.',
  CATEGORY_HAS_COURSES: 'Cannot delete category. It contains courses.',
  CATEGORY_INVALID_POSITION: 'Invalid position value.',

  // Course errors
  COURSE_NOT_FOUND: 'Course not found.',
  COURSE_ALREADY_PUBLISHED: 'This course is already published.',

  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',

  // Validation errors
  VALIDATION_ERROR: 'Please check your input and try again.',
  REQUIRED_FIELD: 'This field is required.',

  // Server errors
  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable.',

  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',

  // Login errors
  INVALID_EMAIL: 'The email address you entered is not registered.',
  INVALID_PASSWORD: 'Incorrect password. Please try again.',
  ACCOUNT_LOCKED:
    'Your account has been locked due to multiple failed login attempts. Please try again in 30 minutes or reset your password.',
  ACCOUNT_DISABLED:
    'Your account has been disabled. Please contact support at support@example.com.',
  EMAIL_NOT_VERIFIED:
    'Please verify your email address. Check your inbox for the verification link.',

  // Session errors
  INVALID_TOKEN: 'Invalid authentication token. Please login again.',
  TOKEN_MISSING: 'Authentication required. Please login.',

  // Register errors
  EMAIL_ALREADY_EXISTS:
    'This email is already registered. Please login instead.',
  WEAK_PASSWORD:
    'Password is too weak. Use at least 8 characters with numbers and symbols.',
  INVALID_EMAIL_FORMAT: 'Please enter a valid email address.',

  // Password reset errors
  RESET_TOKEN_EXPIRED:
    'Password reset link has expired. Please request a new one.',
  RESET_TOKEN_INVALID: 'Invalid password reset link. Please request a new one.',
  EMAIL_NOT_FOUND: 'No account found with this email address.',

  CHECK_INPUT: 'Please check your input and try again.',
};

export const ERROR_TITLES: Record<number, string> = {
  400: 'Invalid Request',
  401: 'Authentication Required',
  403: 'Access Denied',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Validation Error',
  429: 'Too Many Requests',
  500: 'Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};
