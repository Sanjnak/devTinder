const  mongoose  = require("mongoose");
const user = require("./user");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: user,
            required: true,
        },
        toUserId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: user, 
            required: true,
        },
        status : {
            type: String,
            required: true,
            enum: {
                values: ["Interested", "Ignored", "Accepted", "Rejected"],
                message: `{VALUE} is not supported!`
            }
        }
    },
    {
        timestamps: true
    }
);

connectionRequestSchema.pre("save", async function () {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("User cannot send request to themselves!");
    }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
