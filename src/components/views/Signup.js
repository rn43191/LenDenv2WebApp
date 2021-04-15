import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";

import { Container, Col, Row, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { JwtDecode } from "../../utils/JwtDecode";

export default function Signup() {
	const { state, dispatch } = useContext(UserContext);
	const history = useHistory();

	const [alert, setAlert] = useState("");
	const [first_name, setFirst_name] = useState("");
	const [last_name, setLast_name] = useState("");
	const [user_id, setUser_id] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	const PostData = () => {
		fetch("/signup", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				first_name: first_name,
				last_name: last_name,
				user_id: user_id,
				password: password,
				email: email,
				phone: phone,
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
		<div className="main-signup-div">
			<Container className="main-signup-container">
				<Row className="main-signup-row">
					<Col xs={5} className="main-img-div">
						<div>
							<img src="https://img.icons8.com/plasticine/2x/general-ledger.png" alt="" />
							<h4>Len Den</h4>
							<span>Online Ledger App</span>
						</div>
					</Col>
					<Col xs={7} className="main-form-div">
						<div className="signup-form">
							<Form.Row>
								<Form.Group as={Col} controlId="first_name">
									<Form.Control
										type="text"
										placeholder="First Name"
										value={first_name}
										onChange={(e) => setFirst_name(e.target.value)}
									/>
								</Form.Group>
								<Form.Group as={Col} controlId="last_name">
									<Form.Control
										type="text"
										placeholder="Last Name"
										value={last_name}
										onChange={(e) => setLast_name(e.target.value)}
									/>
								</Form.Group>
							</Form.Row>

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

							<Form.Group controlId="email">
								<Form.Control type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
							</Form.Group>

							<Form.Group controlId="phone">
								<Form.Control type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
							</Form.Group>

							<Form.Group controlId="password">
								<Form.Control
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Form.Group>
							<div className="text-center">
								<Button variant="outline-primary" type="submit" block onClick={(e) => PostData()}>
									Sign up
								</Button>
								<span>
									Already have an account ? <Link to="/signin">Login</Link>
								</span>
								{alert ? <Alert variant="danger">{alert}</Alert> : ""}
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
