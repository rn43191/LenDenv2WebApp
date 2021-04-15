import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";

import {
	Container,
	Col,
	Row,
	Button,
	Alert,
	Dropdown,
	DropdownButton,
	ListGroup,
	Card,
	Spinner,
	InputGroup,
	FormControl,
} from "react-bootstrap";
import Nothing from "../NothingToShow";
import LenDenModal from "../LenDenModal";
import ProfileModal from "../ProfileModal";
import UserProfileModal from "../UserProfileModal";

export default function Home() {
	const { state, dispatch } = useContext(UserContext);
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const [convoID, setConvoID] = useState(null);
	const [profileData, setProfileData] = useState(null);
	const [convoData, setConvoData] = useState(null);

	const [message, setMessage] = useState("");
	const [amount, setAmount] = useState("");
	const handleSetAmount = (x) => setAmount(x);

	const scrollToBottom = (id) => {
		var div = document.getElementById(id);
		div.scrollTop = div.scrollHeight - div.clientHeight;
	};

	const [formValidated, setFormValidated] = useState(false);

	const [lenModalShow, setLenModalShow] = useState(false);
	const handleLenModalShow = () => {
		setLenModalShow(true);
		setFormValidated(false);
	};
	const handleLenModalClose = () => setLenModalShow(false);

	const [denModalShow, setDenModalShow] = useState(false);
	const handleDenModalShow = () => {
		setDenModalShow(true);
		setFormValidated(false);
	};
	const handleDenModalClose = () => setDenModalShow(false);

	const [profileModalShow, setProfileModalShow] = useState(false);
	const handleProfileModalClose = () => setProfileModalShow(false);
	const handleProfileModalShow = () => setProfileModalShow(true);

	const [userProfileModalShow, setUserProfileModalShow] = useState(false);
	const handleUserProfileModalClose = () => setUserProfileModalShow(false);
	const handleUserProfileModalShow = () => setUserProfileModalShow(true);

	useEffect(() => {
		if (localStorage.getItem("jwt")) {
			fetch("http://localhost:5002/summarizedconvo", {
				method: "get",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + JSON.parse(localStorage.getItem("jwt"))["access_token"],
				},
			})
				.then((res) => res.json())
				.then((result) => {
					if (!result.error) {
						// console.log("safe", result.data);
						const sortedRes = result.data.sort(function (x, y) {
							return y.convoDetail.last_commit - x.convoDetail.last_commit;
						});
						setConversations(sortedRes);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, []);

	const mountAgain = () => {
		if (localStorage.getItem("jwt")) {
			fetch("http://localhost:5002/summarizedconvo", {
				method: "get",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + JSON.parse(localStorage.getItem("jwt"))["access_token"],
				},
			})
				.then((res) => res.json())
				.then((result) => {
					if (!result.error) {
						// console.log("safe", result.data);
						const sortedRes = result.data.sort(function (x, y) {
							return y.convoDetail.last_commit - x.convoDetail.last_commit;
						});
						setConversations(sortedRes);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	useEffect(() => {
		if (convoID && localStorage.getItem("jwt")) {
			fetch(`http://localhost:5002/getmemo/${convoID}`, {
				method: "get",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Token " + JSON.parse(localStorage.getItem("jwt"))["access_token"],
				},
			})
				.then((res) => res.json())
				.then((result) => {
					if (!result.error) {
						const sortedRes = result.data.sort(function (x, y) {
							return y.sent_time - x.sent_time;
						});
						// console.log("sort", sortedRes);
						setConvoData(sortedRes);
						setLoading(false);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
		if (convoID) {
			scrollToBottom("chat-content-id");
		}
	}, [convoID]);

	const handleConvoClick = (id, data) => {
		setConvoID(id);
		setProfileData(data);
		if (id !== convoID) {
			setLoading(true);
		}
	};

	const handleConvoBackClick = () => {
		setConvoID(null);
		setProfileData(null);
	};

	const postMessage = () => {
		fetch("http://localhost:5002/memo", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + JSON.parse(localStorage.getItem("jwt"))["access_token"],
			},
			body: JSON.stringify({
				memo_type: "chat",
				msg_type: "normal",
				memo: message,
				conversation_id: convoID,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				if (!result.error) {
					setConvoData((convoData) => [result.data, ...convoData]);
				}
				setMessage("");
				mountAgain();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const handleFormSubmit = (event) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}
		setFormValidated(true);
		event.preventDefault();
		const t_type = event.target.id === "Len" ? 1 : -1;
		fetch("http://localhost:5002/memo", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Token " + JSON.parse(localStorage.getItem("jwt"))["access_token"],
			},
			body: JSON.stringify({
				memo_type: "transaction",
				transaction_type: t_type,
				memo: parseFloat(amount),
				conversation_id: convoID,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				if (!result.error) {
					setConvoData((convoData) => [result.data, ...convoData]);
				}
			})
			.then(() => {
				mountAgain();
			})
			.catch((e) => {
				console.log(e);
			});
		t_type === 1 ? handleLenModalClose() : handleDenModalClose();
		setAmount("");
		setFormValidated(false);
	};

	const logOutAction = () => {
		localStorage.clear();
		dispatch({ type: "CLEAR" });
		history.push("/signin");
	};

	return (
		<div className="main-dashboard-div">
			<Container fluid className="main-dashboard-container">
				<Row className="main-dashboard-row">
					<Col xs={3} className="main-dashboard-col1">
						<div className="bg-light  main-sidebar-div">
							<div className="d-flex border-bottom sidebar-profile">
								<div className="d-flex sidebar-profile-content" onClick={handleUserProfileModalShow}>
									{state && state.user.image_url ? (
										<img className="rounded-circle" src={state.user.image_url} alt="Profile" />
									) : (
										<img
											className="rounded-circle"
											src="https://www.spicefactors.com/wp-content/uploads/default-user-image.png"
											alt="Profile"
										/>
									)}
									{state ? (
										<div className="sidebar-profile-name" style={{ display: "flex", alignItems: "center" }}>
											<span style={{ fontSize: "large" }}>
												{state.user.first_name} {state.user.last_name}
											</span>
										</div>
									) : (
										"..."
									)}
								</div>
								<DropdownButton
									className="float-right"
									id="dropdown-item-button"
									title=""
									menuAlign="right"
									style={{
										marginRight: "5px",
									}}
								>
									<Dropdown.Item as="button" type="submit" name="action" onClick={() => logOutAction()}>
										<i className="bi bi-box-arrow-left"></i> Sign Out
									</Dropdown.Item>
								</DropdownButton>
							</div>
							{state ? (
								<UserProfileModal data={state.user} show={userProfileModalShow} onHide={handleUserProfileModalClose} />
							) : (
								<></>
							)}
							<div className="bg-white sidebar-convo">
								<ListGroup className="sidebar-convo-list" variant="flush">
									{conversations.length ? (
										conversations.map((connversation) => {
											return (
												<ListGroup.Item
													key={connversation.convoDetail._id.$oid}
													className="d-flex sidebar-convo-item"
													onClick={() => handleConvoClick(connversation.convoDetail._id.$oid, connversation)}
												>
													<div className="d-flex sidebar-convo-item-content">
														<div>
															<h6 className="font-weight-normal sidebar-profile-name">
																{connversation.convoDetail.title}
															</h6>
															<div id="sidebar-profile-summary">
																{connversation.summaryDetail.len - connversation.summaryDetail.den === 0 ? (
																	<span style={{ color: "indigo" }}>No Dues</span>
																) : connversation.summaryDetail.len - connversation.summaryDetail.den >
																  0 ? (
																	<span className="len-amount">
																		Len: ₹&nbsp;
																		{parseFloat(
																			connversation.summaryDetail.len -
																				connversation.summaryDetail.den
																		).toFixed(2)}
																	</span>
																) : (
																	<span className="den-amount">
																		Den: ₹&nbsp;
																		{parseFloat(
																			connversation.summaryDetail.den -
																				connversation.summaryDetail.len
																		).toFixed(2)}
																	</span>
																)}
															</div>
														</div>
													</div>
													<div className="sidebar-convo-item-data">
														<p className="font-italic text-right">~{connversation.convoDetail.creator_id}</p>
													</div>
												</ListGroup.Item>
											);
										})
									) : (
										<Spinner style={{ margin: "auto" }} animation="border" role="status">
											<span className="sr-only">Loading...</span>
										</Spinner>
									)}
								</ListGroup>
							</div>
						</div>
					</Col>
					<Col xs={9} className="main-dashboard-col2">
						{convoID ? (
							<div className="chat-box">
								<div className="d-flex border-bottom chat-header">
									<div className="chat-back float-left">
										<Button className="mr-2" variant="outline-light" onClick={handleConvoBackClick}>
											<i className="bi bi-chevron-left" style={{ color: "black" }}></i>
										</Button>
									</div>
									<div className="d-flex chat-profile-content" onClick={handleProfileModalShow}>
										<div className="chat-profile-name">{profileData ? profileData.convoDetail.title : ""}</div>
									</div>
									<ProfileModal data={profileData} show={profileModalShow} onHide={handleProfileModalClose} />
									<div className="chat-navigator float-right">
										<Button className="mr-2" variant="light" onClick={() => scrollToBottom("chat-content-id")}>
											<i className="bi bi-arrow-bar-down"></i>
										</Button>
									</div>
								</div>
								<div id="chat-content-id" className="chat-content">
									<div style={{ minHeight: "20px", width: "100%" }}></div>
									{state && convoData && !loading ? (
										convoData.map((chat) => {
											return chat.memo_type === "transaction" ? (
												state.user_id === chat.sender_id ? (
													chat.type === 1 ? (
														<div key={chat._id.$oid} className="chat-right-box">
															<Card className="mb-2" border="success" style={{ width: "18rem" }}>
																<Card.Body>
																	<Card.Title className="chat-len-box-amount">
																		₹ {chat.amount} <span>~ {chat.sender_id}</span>
																	</Card.Title>
																	<Card.Text>{chat.message}</Card.Text>
																</Card.Body>
																<Card.Footer className="text-muted">
																	{Intl.DateTimeFormat("en-US", {
																		year: "numeric",
																		month: "2-digit",
																		day: "2-digit",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																	}).format(chat.sent_time * 1000)}
																</Card.Footer>
															</Card>
														</div>
													) : (
														<div key={chat._id.$oid} className="chat-right-box">
															<Card className="mb-2" border="danger" style={{ width: "18rem" }}>
																<Card.Body>
																	<Card.Title className="chat-den-box-amount">
																		₹ {chat.amount} <span>~ {chat.sender_id}</span>
																	</Card.Title>
																	<Card.Text>{chat.message}</Card.Text>
																</Card.Body>
																<Card.Footer className="text-muted">
																	{Intl.DateTimeFormat("en-US", {
																		year: "numeric",
																		month: "2-digit",
																		day: "2-digit",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																	}).format(chat.sent_time * 1000)}
																</Card.Footer>
															</Card>
														</div>
													)
												) : chat.type === 1 ? (
													<div key={chat._id.$oid} className="chat-left-box">
														<Card className="mb-2" border="danger" style={{ width: "18rem" }}>
															<Card.Body>
																<Card.Title className="chat-den-box-amount">
																	₹ {chat.amount} <span>~ {chat.sender_id}</span>
																</Card.Title>
																<Card.Text>{chat.message}</Card.Text>
															</Card.Body>
															<Card.Footer className="text-muted">
																{Intl.DateTimeFormat("en-US", {
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																	hour: "2-digit",
																	minute: "2-digit",
																	second: "2-digit",
																}).format(chat.sent_time * 1000)}
															</Card.Footer>
														</Card>
													</div>
												) : (
													<div key={chat._id.$oid} className="chat-left-box">
														<Card className="mb-2" border="success" style={{ width: "18rem" }}>
															<Card.Body>
																<Card.Title className="chat-len-box-amount">
																	₹ {chat.amount} <span>~ {chat.sender_id}</span>
																</Card.Title>
																<Card.Text>{chat.message}</Card.Text>
															</Card.Body>
															<Card.Footer className="text-muted">
																{Intl.DateTimeFormat("en-US", {
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																	hour: "2-digit",
																	minute: "2-digit",
																	second: "2-digit",
																}).format(chat.sent_time * 1000)}
															</Card.Footer>
														</Card>
													</div>
												)
											) : state.user_id === chat.sender_id ? (
												<div key={chat._id.$oid} className="chat-message-box">
													<Card
														className="mb-2"
														border="primary"
														style={{ margin: "10px", width: "30rem", float: "right", borderRadius: "10px" }}
													>
														<Card.Body className="d-flex" style={{ padding: "0.75rem" }}>
															<Card.Title
																style={{ fontWeight: "normal", fontSize: "1.1rem", width: "70%" }}
																className="chat-message"
															>
																{chat.message}
															</Card.Title>
															<Card.Text
																className="d-flex text-muted"
																style={{
																	marginLeft: "auto",
																	alignItems: "flex-end",
																	flexDirection: "column",
																}}
															>
																<span style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
																	~ {chat.sender_id}
																</span>
																<span className="timestamp">
																	{Intl.DateTimeFormat("en-US", {
																		year: "numeric",
																		month: "2-digit",
																		day: "2-digit",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																	}).format(chat.sent_time * 1000)}
																</span>
															</Card.Text>
														</Card.Body>
													</Card>
												</div>
											) : (
												<div key={chat._id.$oid} className="chat-message-box">
													<Card
														className="mb-2"
														border="primary"
														style={{ margin: "10px", width: "30rem", float: "left", borderRadius: "10px" }}
													>
														<Card.Body className="d-flex" style={{ padding: "0.75rem" }}>
															<Card.Title
																style={{ fontWeight: "normal", fontSize: "1.1rem", width: "70%" }}
																className="chat-message"
															>
																{chat.message}
															</Card.Title>
															<Card.Text
																className="d-flex text-muted"
																style={{
																	marginLeft: "auto",
																	alignItems: "flex-end",
																	flexDirection: "column",
																}}
															>
																<span style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
																	~ {chat.sender_id}
																</span>
																<span className="timestamp">
																	{Intl.DateTimeFormat("en-US", {
																		year: "numeric",
																		month: "2-digit",
																		day: "2-digit",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																	}).format(chat.sent_time * 1000)}
																</span>
															</Card.Text>
														</Card.Body>
													</Card>
												</div>
											);
										})
									) : (
										<Spinner style={{ margin: "auto" }} animation="border" role="status">
											<span className="sr-only">Loading...</span>
										</Spinner>
									)}
									{!loading ? (
										!convoData.length ? (
											<h4 style={{ margin: "0 auto 200px auto" }}>No Transactions or messages yet</h4>
										) : (
											<></>
										)
									) : (
										<></>
									)}
								</div>
								<div className="d-flex border-top chat-footer">
									<InputGroup size="lg" className="chat-message-input">
										<FormControl
											id="message-input"
											placeholder="Type a message"
											type="text"
											value={message}
											onChange={(e) => {
												setMessage(e.target.value);
											}}
										/>
										<InputGroup.Append>
											<Button
												id="message-send"
												variant="outline-primary"
												type="submit"
												onClick={(e) => postMessage()}
											>
												Send
											</Button>
										</InputGroup.Append>
									</InputGroup>
									<div className="len-button">
										<Button
											size="lg"
											variant="outline-success"
											block
											onClick={handleLenModalShow}
											style={{ padding: "0" }}
										>
											<i className="bi bi-arrow-down-circle-fill" style={{ fontSize: "2rem" }}></i>
										</Button>
									</div>
									<div className="den-button">
										<Button
											size="lg"
											variant="outline-danger"
											block
											onClick={handleDenModalShow}
											style={{ padding: "0" }}
										>
											<i className="bi bi-arrow-up-circle-fill" style={{ fontSize: "2rem" }}></i>
										</Button>
									</div>

									<LenDenModal
										lenden_type="Len"
										amount={amount}
										set_amount={handleSetAmount}
										isvalidated={formValidated}
										form_submit={handleFormSubmit}
										show={lenModalShow}
										onHide={handleLenModalClose}
									/>
									<LenDenModal
										lenden_type="Den"
										amount={amount}
										set_amount={handleSetAmount}
										isvalidated={formValidated}
										form_submit={handleFormSubmit}
										show={denModalShow}
										onHide={handleDenModalClose}
									/>
								</div>
							</div>
						) : (
							<Nothing />
						)}
					</Col>
				</Row>
			</Container>
		</div>
	);
}
