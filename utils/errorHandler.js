/**
 * @param {*} error object
 * @param {*} res http response
 * @param {*} customMessage error message provided by route
 * @returns error status with message
 */
export const errorHandler = (error, res, customMessage = "Error") => {
  if (!res) return null;
  const { status, data } = error?.response || {};
  return res
    .status(status ?? 500)
    .json({ message: data?.message || customMessage });
};
