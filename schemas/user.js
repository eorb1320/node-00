const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userNum: {
    type: Number,
    required: true,
    unique:true,
    },
    email: String,
    nickname: String,
    password: String,
  });

UserSchema.virtual("boardNum").get(function () {
return this._id.toHexString();
});
UserSchema.set("toJSON", {
virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);


// 유저에 대한 정보 스키마 회원가입 할때 