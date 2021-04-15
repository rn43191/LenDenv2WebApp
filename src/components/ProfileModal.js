import React from "react";

import { Modal } from "react-bootstrap";

export default function ProfileModal(props) {
	return (
		<Modal size="sm" show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered animation={false}>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">{props.data.convoDetail.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h6 className="mb-0">Description</h6>
				<div className="mb-2">{props.data.convoDetail.description ? props.data.convoDetail.description : "No Decription Set"}</div>
				<h6>Participants</h6>
				<ul>
					{props.data.convoDetail.participants.map((p) => {
						return <li key={p}>{p}</li>;
					})}
				</ul>
			</Modal.Body>
			<Modal.Footer className="profile-summary">
				<div className="profile-modal-len">
					Total Len : <span>₹ {props.data.summaryDetail.len}</span>
				</div>
				<div className="profile-modal-den">
					Total Den : <span>₹ {props.data.summaryDetail.den}</span>
				</div>
			</Modal.Footer>
		</Modal>
	);
}
