import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			firstName
			lastName
			email
		}
	}
`;

export const GET_DB_REGIONS = gql`
	query GetDBRegions {
		getAllRegions{
			_id
			name
			owner
			map
			children
			landmark
			capital
			leader
			parent
		}
	}
`;

export const GET_DB_REGION = gql`
	query GetDBRegions($_id: String!) {
		getRegionById(_id: $_id){
			_id
			name
			owner
			map
			children
			landmark
			capital
			leader
			parent
		}
	}
`;


