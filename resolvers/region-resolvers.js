const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

module.exports = {
    Query: {
        /** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of todolist objects on success, and an empty array on failure
		**/
		getAllRegions: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const regions = await Region.find({owner: _id});
			if(regions) return (regions);

		},
			/** 
		 	@param 	 {object} args - a todolist id
			@returns {object} a todolist on success and an empty object on failure
		**/
		getRegionById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const region = await Region.findOne({_id: objectId});
			if(region) return region;
			else return ({});
		},

    },
    Mutation: {
        addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, children } = map;
			const newMap = new Region({
				_id: objectId,
				name: name,
				owner: owner,
				map: true,
				children: children,
				path: []
			});
			const updated = await newMap.save();
			// const updated = await newList.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},

		addRegion: async (_, args) => {
			const { _id, map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, children } = map;
			const region = await Region.findOne({_id: _id});
			let path = [];
			region.path.map(x => path.push(x))
			path.push(_id)
			const newMap = new Region({
				_id: objectId,
				name: name,
				owner: owner,
				map: false,
				children: children,
				capital: "None",
				leader: "None",
				landmarks: ["None"],
				parent: _id,
				path: path
			});
			const updated = await newMap.save();
			region.children.push(objectId);
			await region.save();
			// const updated = await newList.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},

		deleteRegion: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const region = await Region.findOne({_id: objectId});
			if(region.parent){
				const parent = await Region.findOne({_id: region.parent});
				const children = parent.children;
				const index = children.indexOf(objectId)
				children.splice(index, 1)
				const updated = await Region.updateOne({_id: region.parent}, {children: children});
			}
			const deleted = await Region.deleteOne({_id: objectId})
			if(deleted) return ("deleted");
			else return ("no");
		},

		updateRegion: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Region.updateOne({_id: objectId}, {[field]: value});
			console.log(value);
			if(updated) return value;
			else return "";
		},

		sort: async (_, args) => {
			const { value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Region.updateOne({_id: objectId}, {children: value});
			console.log(value);
			if(updated) return value.toString();
			else return "";
		},
    }
}