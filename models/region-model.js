const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		id: {
			type: Number,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
        map: {
            type: Boolean,
            required: true
        },
        sister: {
            type: [String]
        },
        children: {
            type: [String],
            required: true
        },
        landmark: {
            type: String
        },
        capital: {
            type: String
        },
        leader: {
            type: String
        }
	}
);

const Region = model('Region', regionSchema);
module.exports = Region;