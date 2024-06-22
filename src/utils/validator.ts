export const validateSignUp = (
  email: string,
  password: string,
  username: string
) => {
  const errors = [];

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push({ errorCode: "emailInvalid", location: "email" });
  }
  if (!password || password.length < 8) {
    errors.push({ errorCode: "passwordLength", location: "password" });
  }
  if (!username) {
    errors.push({ errorCode: "usernameRequired", location: "username" });
  }

  return errors;
};
