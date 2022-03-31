const mongoose = require("mongoose");

// 엄마아이디, 닉네임 날짜, 댓글 
// 댓글 스키마 


const ReplySchema = new mongoose.Schema({
    nickname: String,
    Data: String,
    reply: String,
    // parentId : String,
    boardNum: {   //한 게시글안에서 댓글을 여러개 달수있으니 보드넘이 중복이 되면안됨 
      type:Number,
      required: true,
    },
    userNum:{ 
      type:Number,
      required:true,
    },
    replyNum : {
      type:Number,
      required:true,
      unique:true,
    }
  });

module.exports = mongoose.model("Reply", ReplySchema);





