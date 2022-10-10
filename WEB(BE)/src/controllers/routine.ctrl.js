const data = require('../models/index');
const jwt = require('../token/jwt');

const maxStep = 5;

const user = {
	isToken : (req, res) => {
		try{
			if(req.headers.authorization && req.headers.authorization.split(' ')[1]){
				return true;
			}

			else{
				return false;
			}
		}
		
		catch(err){
			console.log(err);
			return false;
		}
		
	},
	
	getId : (req, res) => {
		if(!user.isToken(req, res)){
			res.json({
				msg : '로그인을 해주세요!',
				isLogin : false
			})
		}
		
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.token.decode(token);
		
		return decode.id;
	}
}

const routine = {
	make : (req, res) =>{
		
		if(!user.isToken(req, res)){
			return res.json({
				msg : "로그인을 해주세요!",
				isLogin : false
			})
		}
		
		var auth_description_list = [req.body.auth_description_1, req.body.auth_description_2, req.body.auth_description_3, req.body.auth_description_4, req.body.auth_description_5];
		
		let i = 0;
		for(const item of auth_description_list){
			if(!item){
				auth_description_list.length = i;
				break;
			}
			i++;
		}
		
		const creator_id = user.getId(req, res);
		const title = req.body.name;
		const category = req.body.category;
		const image = `/images/${req.file.filename}`;
		const auth_cycle = req.body.auth_cycle;
		const auth_description = JSON.stringify(auth_description_list);
		const start_date = req.body.start_date;
		const duration = req.body.duration;
		const point_info_list = 'NULL'; // 변경 예정
		
		var param = [creator_id , title, category, image, auth_cycle, auth_description, start_date, duration, point_info_list];;
		data.routine.add(param);
		
		return res.json({
			routine : param,
			msg : "루틴 개설 완료!"
		})
	}
}

module.exports = {
	routine
}