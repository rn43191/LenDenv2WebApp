import jwt_decode from "jwt-decode";

export const JwtDecode = (token) => {
	const decoded = jwt_decode(token);
	return decoded;
};
