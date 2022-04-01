var fetch = require('node-fetch');
var {Headers} = require('node-fetch');
var fs = require('fs');
const FormData = require('form-data');
var {parse} = require('node-html-parser');
const cv = require('opencv4nodejs');

var COLOR_UP=new cv.Vec(256,256,256);
var COLOR_LOWER=new cv.Vec(220,220,220);

(async()=>{

	const t1 = cv.imread('./imgs/t1.jpg');
	const t2 = cv.imread('./imgs/t2.png');
	var t1_mask=t1.inRange(COLOR_LOWER,COLOR_UP)
	var t2_mask=t2.inRange(COLOR_LOWER,COLOR_UP)
	var t1_c=t1_mask.canny(50, 100, 3, false)
	var t2_c=t2_mask.canny(50, 100, 3, false)	
	var t1_mask_result=t1_c.resize(200, 340);
	var t2_mask_result=t2_c.resize(68, 68);
	var match=t1_mask_result.matchTemplate(t2_mask_result,cv.TM_CCOEFF)
	var result=match.minMaxLoc()
	console.log(result.maxLoc.x)


	//cv.imshow('a window name', t1_c);
	//cv.imwrite('./imgs/t1_c.jpg', t1_c);
	//cv.imwrite('./imgs/t2_c.jpg', t2_c);
	//cv.imwrite('./imgs/t2p.png', t2_mask_result);



})()

//console.log(cv.Mat.prototype.matchTemplate.toString())

//https://docs.opencv.org/3.4/d8/dd1/tutorial_js_template_matching.html


function delay(time){
	return new Promise((res,rej)=>{
		setTimeout(()=>{res()},time)
	})
}


//https://shop2game.com/app/
//808306716