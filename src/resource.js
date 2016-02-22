// 2016/01/29 14:10 刪除註解

var res = {
	android_png				: "res/android.png" ,
    cocos2d_png 			: "res/cocos2d.png" ,
    dragonbones_png			: "res/dragonbones.png" ,
	firefox_png				: "res/firefox.png" ,
	github_png				: "res/github.png" ,
	html5_png				: "res/html5.png" ,
	nodejs_png				: "res/nodejs.png" ,
	ubuntu_png				: "res/ubuntu.png" ,
	question_png			: "res/question.png" ,
	
	leave_normal_png		: "res/leave_normal.png" ,
	leave_selected_png		: "res/leave_selected.png" ,
	try_again_normal_png	: "res/try_again_normal.png" ,
	try_again_selected_png	: "res/try_again_selected.png" ,
	
	correct_mp3				: "res/correct.mp3" ,
	wrong_mp3				: "res/wrong.mp3" ,
	clear_mp3				: "res/clear.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}