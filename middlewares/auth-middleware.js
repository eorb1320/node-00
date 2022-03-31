const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

//jwt token 확인 module
module.exports = (req, res, next) => {
    const {authorization} = req.headers; // 헤더에서 auth~가 있음 
    const {tokenType, tokenValue} = authorization.split(" "); 
    // const [authType, authToken] = (authorization || "").split(" "); //공백을 기준으로 type과 token을 분리

    if(tokenType !== "Bearer") {
        res.status(401).send({
            errorMessage : "로그인 후 이용하세요."
        });
        return;
    }

    try {
        const {boardNum} = jwt.verify(tokenValue, "my-secret-key");
        User.findById(boardNum).exec().then((user) =>{
        res.locals.user = user;
        next();
        });
        
    } catch(error){
        res.status(401).send({
            errorMessage : "로그인 후 사용하세요."
        });
        return;
    }
    
};
