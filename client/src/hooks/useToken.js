import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useToken = () => {
	const [token, setToken] = useState(null);
	const AccessToken = useSelector(state => state.auth.token);

	useEffect(() => {
		setToken(AccessToken);
	}, [setToken, AccessToken]);

	return [token];
};

export default useToken;
