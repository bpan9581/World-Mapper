const { gql } = require('apollo-server');

const typeDefs = gql `
    type Region {
        _id: String!
		owner: String!
        name: String!
        map: Boolean!
		sister: [String]
        children: [String]
        landmark: [String]
        capital: String
        leader: String
        parent: String
	}
    
    extend type Query {
		getAllRegions: [Region]
		getRegionById(_id: String!): Region
	}

    extend type Mutation {
        addMap(map: MapInput!): String
        addRegion(_id: String!, map: MapInput!): String
        deleteRegion(_id: String!): String
        updateRegion(_id: String!, field: String, value: String!): String
    }

    input MapInput{
        _id: String
		name: String
		owner: String
        children: [String]
    }
`;

module.exports = { typeDefs: typeDefs }