import { jwtDecode, JwtPayload } from "jwt-decode";

export function isTokenExpired(val: string) {
  if (!val) return false;

  try {
    const decodedToken = jwtDecode<JwtPayload>(val);
    const currentTime = Date.now() / 1000;

    if (!decodedToken.exp) return false;
    return decodedToken.exp < currentTime ? true : false;
  } catch (e) {
    console.error("Error decoding token:", e);
    return false;
  }
}
