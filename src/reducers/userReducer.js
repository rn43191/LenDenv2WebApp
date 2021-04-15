import { USER, USER_TOKEN, CLEAR, USER_ID, TEST } from "../constants/userConstants";

export const initialState = null;

export const reducer = (state, action) => {
	switch (action.type) {
		case USER:
			return {
				...state,
				user: action.payload,
			};
		case USER_ID:
			return {
				...state,
				user_id: action.payload,
			};
		case USER_TOKEN:
			return action.payload;
		case CLEAR:
			return null;
		case TEST:
			return {
				...state,
				test_id: action.payload,
			};
		default:
			return state;
	}
};
