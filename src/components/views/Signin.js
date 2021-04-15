import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";

import { Container, Col, Row, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { JwtDecode } from "../../utils/JwtDecode";
import Logo from "../../utils/logo.png";

export default function Signin() {
	const { state, dispatch } = useContext(UserContext);
	const history = useHistory();

	const [alert, setAlert] = useState("");
	const [user_id, setUser_id] = useState("");
	const [password, setPassword] = useState("");

	const PostData = () => {
		fetch("/signin", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: user_id,
				password: password,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				// console.log(data);
				if (data.error) {
					setAlert(data.error);
				} else {
					localStorage.setItem("jwt", JSON.stringify(data));
					const decoded = JwtDecode(data.access_token);
					dispatch({ type: "USER_ID", payload: decoded.user_id });
					dispatch({ type: "USER", payload: data.user });
					history.push("/");
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	return (
		<div className="main-signin-div">
			<Container className="main-signin-container">
				<Row className="main-signin-row">
					<Col xs={5} className="main-img-div">
						<div>
							<img src={Logo} alt="" />
							<h4>Len Den</h4>
							<span>Online Ledger App</span>
						</div>
					</Col>
					<Col xs={7} className="main-form-div">
						<div className="signin-form">
							<Form.Group controlId="user_id">
								<InputGroup className="mb-2">
									<InputGroup.Prepend>
										<InputGroup.Text>@</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control
										type="text"
										placeholder="User ID"
										value={user_id}
										onChange={(e) => setUser_id(e.target.value)}
									/>
								</InputGroup>
							</Form.Group>
							<Form.Group controlId="password">
								<Form.Control
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your Password"
								/>
							</Form.Group>
							<div className="text-center">
								<Button variant="outline-primary" type="submit" block onClick={(e) => PostData()}>
									Sign In
								</Button>

								{alert ? <Alert variant="danger">{alert}</Alert> : ""}
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
