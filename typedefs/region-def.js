const { gql } = require('apollo-server');

const typeDefs = gql `
    type Region {
        _id: String!
		owner: String!
        name: String!
        map: Boolean!
        children: [String]
        landmark: [String]
        capital: String
        leader: String
        parent: String
        path: [String]
	}
    
    extend type Query {
		getAllRegions: [Region]
		getRegionById(_id: String!): Region
	}

    extend type Mutation {
        addMap(map: MapInput!): String
        addRegion(_id: String!, map: MapInput!): String
        readdRegion(region: RegionInput!, index: Int!): String
        deleteRegion(_id: String!): Region
        updateRegion(_id: String!, field: String, value: String!): String
        updateRegionLandmark(_id: String!, field: String, value: [String]!): [String]
        sort(_id: String!, value: [String]!): String
    }

    input MapInput{
        _id: String
		name: String
		owner: String
        children: [String]
    }

    input RegionInput {
        _id : String
        name : String
        owner : String
        map : Boolean
        children : [String]
        landmark : [String]
        capital : String
        leader : String
        parent : String
        path : [String]
    }
`;

module.exports = { typeDefs: typeDefs }