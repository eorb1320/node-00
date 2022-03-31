// user_info.js --> 회원에 관련된 라우터를 여기서 다 만들어준다 .

const express = require("express");
const User = require("../schemas/user")
const router = express.Router();

// JWT token
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const token = jwt.sign({test:true}, 'my-secret-key');
// console.log(token);
// const decoded = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2NDgxOTg0ODJ9.XeR9H7yOFS7fFYoiMCH6diebdL0mnbMCimflcsukPQU")
// console.log(decoded);




// 회원가입 API
router.post("/users", async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;
    console.log({ email, nickname, password, confirmPassword })
   // 회원가입을 할때 겹치지 않는 유니크값  userNum--> 만든이유 기존에는 로그인을 안해도 됬지만 지금은 로그인을 해야되서 
  const user_list = await User.find().sort({ "userNum": -1 });
  let userNum = 0;
  if(user_list.length == 0 || user_list == null){
    userNum = 1;
  }else{
    userNum = user_list[0].userNum+1
  }
   

    //password 검증
    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage : '비밀번호를 확인하세요'
        });
        // return하지 않으면 return 아래에 있는 코드를 계속 실행함.
        return;
    };

    // nickname, email 검증
    const existUser = await User.find({
        $or : [{nickname}, {email}], //or 조건 표시 --> $or
    });
    console.log('existUser-->',existUser)
    if (existUser.length){ // length 안쓰면 무한으로 같은거 만들어짐?? 이유?
        res.status(400).send({
            errorMessage : '이미 가입된 이메일 또는 닉네임 입니다.'
        });
        return;
    };
    
    // 중복확인 다른방법 물어보기(개필)
    // if (existUser[1] == nickname && existUser[0] == email){
    //     res.status(400).send({
    //             errorMessage : '이미 가입된 닉네임 입니다.'
    //         });
    //         console.log('response-->',response)
    //         return;
    // };
    const user = new User({userNum,email, nickname, password}); // userNum
    await user.save();
    console.log('new-->',user)
    res.status(201).send({
        Message : '회원가입 완료!'
    })
});


// 로그인 API --> 토큰을 그때마다 발행하고 보안 상 POST 사용
router.post("/auth", async (req,res) => {
    const {email, password} = req.body;
    console.log(req);
    const user = await User.findOne({email, password}).exec(); // db에 있는 데이터를 비교함 
    
    // 사용자가 없는 경우
    if(!user){
        res.status(400).send({
            errorMessage : '이메일 혹은 패스워드가 잘못됐습니다.'
        });
        return;
    };
    // Token 부여               userId : 1
    const token = jwt.sign({ userInfo : user}, "my-secret-key");// 글을 작성할떄 회원아이디만 가지고있느게 아니라 
    res.send({
        token,
    })
    // console.log(token, user) //--> 찍힘
});

//authMiddleware가 없으면 인증을 못해서 res.local에 정보가 없음.
router.get("/users/me", authMiddleware, async (req, res) => {
    const {user} = res.locals; //res.locals 안에 user키를 const user에 할당
    console.log(user)
    res.status(400).send({
    })
})

// loginInfo에서 토큰을 쏴줬다 -> 여기서 받아야겠지 뭐를 token을 req로 받았따. 그후에 json형식으로 보냇다 jwt토큰을 디코드 한걸 userInfo
router.post("/loginInfo", async (req, res) => { // 
//    console.log("들어오는지확인");
  const {token} = req.body;
  res.json({
      userInfo : jwt.decode(token) 
  })
});


module.exports = router; //router를 모듈로 내보낸다.