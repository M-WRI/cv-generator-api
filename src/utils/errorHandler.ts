export const createErrorResponse = (errorCode: string, location: string) => ({
  type: "error",
  errorCode,
  location,
});

export const handleValidationError = (errors: any[]) => {
  return errors.map((error) => {
    return createErrorResponse(error.errorCode, error.location);
  });
};
