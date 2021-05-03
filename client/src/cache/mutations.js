import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			firstName
			lastName
			password
			initials
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_MAP = gql `
	mutation AddMap($map: MapInput!) {
		addMap(map: $map)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($_id: String!){
		deleteRegion(_id: $_id)
	}
`;

export const ADD_REGION = gql `
	mutation AddRegion($_id: String!, $map: MapInput!) {
		addRegion(_id: $_id, map: $map)
	}
`;

export const UPDATE_REGION_FIELD = gql `
	mutation UpdateRegion($_id: String!, $field: String!, $value: String!){
		updateRegion(_id: $_id, field: $field, value: $value)
	}
`;
