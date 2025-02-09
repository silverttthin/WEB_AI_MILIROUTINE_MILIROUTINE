const data = require('../models/index');

function sortFunction(a, b) {
  if (a[1] == b[1]) {
    return 0;
  } else {
    return a[1] > b[1] ? -1 : 1;
  }
}

const process = {
  sortRank: (routines) => {
    var JoinedRoutine = [];

    for (const routine of routines) {
      var isRoutine = false;
      var index;

      if (routine.type == 'join') {
        for (var i = 0; i < JoinedRoutine.length; ++i) {
          if (JoinedRoutine[i][0] == routine.routine_id) {
            isRoutine = true;
            index = i;
            break;
          }
        }

        if (isRoutine) {
          JoinedRoutine[index][1]++;
        } else {
          JoinedRoutine.push([routine.routine_id, 1]);
        }
      }
    }

    JoinedRoutine.sort(sortFunction);
    return JoinedRoutine;
  },
};

const routine = {
	getRankedRoutine : async (res, JoinedRoutine, from, to) =>{
		var rankedRoutine = [];
		for (let rank = from; rank <= to; rank++) {
		  const routine = await data.routine.get('id', JoinedRoutine[rank - 1][0]);
		  routine[0].participants = JoinedRoutine[rank - 1][1];

		  const userInfo = await data.user.get('no', routine[0].host);
		  if(userInfo.length === 0){
			  return res.status(400).json({
				success : false,
				err : '해당 아이디의 host가 없습니다'
			})
		  }

		  routine[0].hostName = userInfo[0].nickname;
		  rankedRoutine.push(routine[0]);
		}
		
		return rankedRoutine;
	}
}

const output = {
  // @route GET /popular
  popular: async (req, res) => {
    const from = Number(req.query.from);
    const to = Number(req.query.to);

    if (!from || from < 1) {
      return res.status(400).json({
        success: false,
        err: 'from query를 입력해주세요',
      });
    }
    if (!to || to <from) {
      return res.status(400).json({
        success: false,
        err: 'to query를 입력해주세요',
      });
    }

    const userRoutines = await data.user_routine.getAll();

    if (userRoutines.length === 0) {
      return res.status(400).json({
        success: false,
        err: '루틴이 없습니다!',
      });
    }

    const JoinedRoutine = process.sortRank(userRoutines);
	  
	const rankedRoutine = await routine.getRankedRoutine(res, JoinedRoutine, from, to);
	  
    res.json({
      success: true,
      rankedRoutine: rankedRoutine,
    });
  },
};

module.exports = {
  output,
  process,
};
