const express = require("express");
const { WriteConcern } = require("mongodb");
const Reply = require("../schemas/reply")
const router = express.Router();

// 댓글을 저장하는 곳 
router.post("/reply", async (req, res) => {  
    let today = new Date();
    let Data = today.toLocaleString(); 
    const { boardNum, reply, nickname, userNum} = req.body;
    if (reply == "" || reply == null || reply == undefined){
      res.send({Message : '댓글입력부탁'})
      return;
    }
    
    const reply_list = await Reply.find().sort({ "replyNum": -1 });
    let replyNum = 0;
    if(reply_list.length == 0 || reply_list.length == null || reply_list.length == undefined){
    replyNum = 1;
    }else{
        replyNum = reply_list[0].replyNum+1
    }
    const saveReply = await Reply.create({ boardNum, reply, nickname, userNum, replyNum, Data});
    res.json({
          saveReply: saveReply
      });
});

// 댓글 리스트 보여주기 
router.post("/replylist", async (req, res) => {
    try {
      const {boardNum} = req.body; // 어느 게시판 번호에 썻는지를 알기위해서 
      const replylist = await Reply.find({boardNum}).sort({ "replyNum": -1 });  
      console.log(replylist);
      res.json({ replylist: replylist });
  } catch (err) {
      console.error(err);
  }
  });




 // 댓글삭제 
  router.delete("/replydelete/:replyNum", async (req, res,) => {
    const {replyNum} = req.body;
    console.log('---->',req);
    // const replyInfo = await Reply.findOne({replyNum})
    // res.json({
    //   replyInfo
    // })
    // console.log(replyNum);
    const deleteReply = await Reply.deleteOne({replyNum:replyNum});
    // console.log(sendwrite);
    res.json({deleteReply : deleteReply}); 
    // console.log(sendwrite);
  });





//댓글 수정 
router.post("/replyModify/:replyNum", async (req, res,) => { // put patch  
    const { replyNum,reply } = req.body;
    let today = new Date();
    let Data = today.toLocaleString();
  
    const modifyReply = await Reply.updateOne({replyNum:replyNum},{reply:reply, Data:Data} )
    res.json({modifyReply:modifyReply})
  });
     // {replyNum}, {$set : { reply}} 


module.exports = router; //router를 모듈로 내보낸다.

// 닉네임, 대댓글 부모, 보드넘(무슨게시판글을 들어갈까), 유저넘 (누가 썻나?), 리플(저장내용 )

   
    
 //view.html (상세조회 화면) 밑
 // 작성은 로그인했을때만 
 //글 내용을 입력하고 작성 누르면 리플에 저장(리플넘버 , 리플내용 , 보드넘버 , 유저넘버,데이트)
 //리플넘버:pk 유니크값
//보드넘버 : 리플이 작성되는 게시글의 보드넘버
//유저넘버 : 작성하고 있는 유저
//  