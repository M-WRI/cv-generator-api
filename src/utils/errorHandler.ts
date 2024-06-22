export const createErrorResponse = (
  errorCode: string,
  location: string
): any => ({
  type: "error",
  errorCode,
  location,
});

export const handleValidationError = (errors: any[]) => {
  return errors.map((error) => {
    return createErrorResponse(error.errorCode, error.location);
  });
};
