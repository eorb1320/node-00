const mongoose = require("mongoose");


//mongoose 데이터 모델링 -> Schema 객체 사용 -> Document 사용
const boardSchema = new mongoose.Schema({
  nickname: { //닉네임
    type: String,
    required: true,
  },
  title: { //제목
    type: String,
    required: true,
  },
  comment: {//내용
    type: String,
    required: true
  },
  password: {//비번
    type: String,
    required: true
  },
  data: {//날짜
    type: String,
    required: true
  },
  boardNum: {   // userId --> boardNum 게시판글순서
    type:Number,
    required: true,
    unique:true,
  },
  userNum:{ // user넘이랑 똑같
    type:Number,
    required:true,
  },
  
});


module.exports = mongoose.model("board", boardSchema);