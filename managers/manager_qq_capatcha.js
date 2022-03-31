var EventEmitter = require('events');
var fetch = require('node-fetch');
var fs = require('fs');
class MyEmitter extends EventEmitter {}
var cv = require('opencv4nodejs');
var COLOR_UP=new cv.Vec(256,256,256);
var COLOR_LOWER=new cv.Vec(220,220,220);

class Manager_qq_capatcha{
	constructor() {
		this.events=new MyEmitter();
		this.media_path='manager_qq_capatcha_media/'
	}

	async download_photo_by_link(link,name){
		try{
			var download_link=link;
			var file_path=`${this.media_path}${name}`;
			var resbond = await fetch(download_link);
			var fileStream = await fs.createWriteStream(file_path);
			var download_state=await new Promise((resolve, reject) => {
			    resbond.body.once("error", ()=>{
			    	console.log('err')
			    	resolve(false)
			    });
			    resbond.body.once("finish", ()=>{
			    	console.log('finish')
			    	resolve(true)
			    });
				fileStream.once('open', function () {
				    resbond.body.pipe(fileStream);
				});			      
			 });
			 if(!download_state){return false}
			 return download_state	
		}catch(err){
			console.log(err)
			return false
		}
	}

	async download_photos(links_array){
		try {
			var download_photo_by_link_state=await this.download_photo_by_link(links_array[0],`t1.jpg`)
			var download_photo_by_link_state=await this.download_photo_by_link(links_array[1],`t2.png`)			
		} catch(e) {
			console.log(e);
			return false
		}

	}

	async solve_sycile(links_array){
		try{
			var download_photos_state=await this.download_photos(links_array)
			await this.delay(3000)
			var t1 = cv.imread(`${this.media_path}t1.jpg`);
			var t2 = cv.imread(`${this.media_path}t2.png`);
			var t1_mask=t1.inRange(COLOR_LOWER,COLOR_UP)
			var t2_mask=t2.inRange(COLOR_LOWER,COLOR_UP)
			var t1_c=t1_mask.canny(50, 100, 3, false)
			var t2_c=t2_mask.canny(50, 100, 3, false)				
			var t1_mask_result=t1_c.resize(200, 340);
			var t2_mask_result=t2_c.resize(68, 68);
			var match=t1_mask_result.matchTemplate(t2_mask_result,cv.TM_CCOEFF)
			var result=match.minMaxLoc()
			return result.maxLoc.x			
		}catch(err){
			console.log(err)
			return false;
		}
	}

 	delay(time){
		return new Promise((res,rej)=>{
			setTimeout(()=>{res()},time)
		})
	}
}


module.exports= new Manager_qq_capatcha


