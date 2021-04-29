const { gql } = require('apollo-server');

const typeDefs = gql `
    type Region {
		id: String
		owner: String
        map: Boolean
		sister: [String]
        children: [String]
        landmark: String
        capital: String
        leader: String
	}
    extend type Query {
		getAllRegions: [Region]
		getRegionById(id: String): Region
	}
    extend type Mutation {}
`;

module.exports = { typeDefs: typeDefs }