export const login = (setAuth, userData, token) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", "true");
  sessionStorage.setItem("userData", JSON.stringify(userData));
  setAuth(true);
};

export const logout = (setAuth) => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userData");
  setAuth(false);
};

export const checkAuth = () => {
  return sessionStorage.getItem("user") === "true";
};

export const getUser = () => {
  const storedUser = sessionStorage.getItem("userData");
  return storedUser ? JSON.parse(storedUser) : null;
};
