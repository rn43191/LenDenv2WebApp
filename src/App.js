import "./App.css";

import React, { useEffect, useReducer, useContext, createContext } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";

import { JwtDecode } from "./utils/JwtDecode";
import HomePage from "./components/views/Home";
import SignInpage from "./components/views/Signin";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
	const history = useHistory();
	const { state, dispatch } = useContext(UserContext);

	useEffect(() => {
		const jwt = JSON.parse(localStorage.getItem("jwt"));
		if (jwt) {
			const decoded = JwtDecode(jwt.access_token);
			dispatch({ type: "USER_ID", payload: decoded.user_id });
			dispatch({ type: "USER", payload: jwt.user });
		} else {
			history.push("/signin");
		}
	}, []);

	return (
		<Switch>
			<Route exact path="/" component={HomePage} />
			<Route path="/signin" component={SignInpage} />
		</Switch>
	);
};

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<div className="App">
			<UserContext.Provider value={{ state, dispatch }}>
				<Router>
					<Routing />
				</Router>
			</UserContext.Provider>
		</div>
	);
}

export default App;
