import React from "react";

import { Modal } from "react-bootstrap";

export default function UserProfileModal(props) {
	return (
		<Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered animation={false}>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					{props.data.first_name} {props.data.last_name}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<img className="rounded-circle" src={props.data.image_url} alt="" style={{ width: "100px", height: "100px" }} />
				<div>Email : {props.data.email}</div>
				<div>Phone : {props.data.phone}</div>
			</Modal.Body>
			<Modal.Footer className="profile-summary">
				Account created :{" "}
				{Intl.DateTimeFormat("en-US", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				}).format(props.data.created_at * 1000)}
			</Modal.Footer>
		</Modal>
	);
}
