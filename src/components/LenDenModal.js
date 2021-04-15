import React from "react";

import { Modal, Button, Form, InputGroup } from "react-bootstrap";

export default function LenDenModal(props) {
	return (
		<Modal size="sm" show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered animation={false}>
			<Modal.Header closeButton style={{ padding: "0.5rem 1.5rem" }}>
				<Modal.Title id="contained-modal-title-vcenter">{props.lenden_type}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form id={props.lenden_type} noValidate validated={props.isvalidated} onSubmit={props.form_submit}>
					<Form.Group controlId="amount">
						<InputGroup className="mb-2">
							<Form.Control
								size="lg"
								type="number"
								value={props.amount}
								onChange={(e) => props.set_amount(e.target.value)}
								placeholder="Amount (in Rupees)"
								required
							/>
							<Form.Control.Feedback type="invalid">Please enter an amount.</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					{props.lenden_type === "Len" ? (
						<Button variant="outline-success" type="submit" style={{ marginRight: "8px" }}>
							Add
						</Button>
					) : (
						<Button variant="outline-danger" type="submit" style={{ marginRight: "8px" }}>
							Add
						</Button>
					)}
					<Button variant="outline-secondary" onClick={props.onHide}>
						Close
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
