const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
        _id: {
			type: ObjectId,
			required: true
		},
        name: {
            type: String,
            require: true
        },
		owner: {
			type: String,
			required: true
		},
        map: {
            type: Boolean,
            required: true
        },
        children: {
            type: [ObjectId],
            required: false
        },
        landmark: {
            type: [String],
            required: false
        },
        capital: {
            type: String,
            required: false
        },
        leader: {
            type: String,
            required: false
        },
        parent: {
			type: ObjectId,
			required: false
		},
        path: {
            type: {ObjectId},
            required: false
        }
	},
    { timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;