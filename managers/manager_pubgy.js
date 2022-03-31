var EventEmitter = require('events');
var jsonfile = require('jsonfile')
var fetch = require('node-fetch');
var FormData = require('form-data');
var path = require('path')
class MyEmitter extends EventEmitter {}
class Manager_pubgy{
	constructor(props) {
		this.reservers={};
		this.last_reserver_id;
		this.in_get_recerjen=false;
		this.last_sycile_id=0;
		this.cache_file_path=path.join(__dirname,'../pubgy_cache.json')
		this.cache;
		this.events=new MyEmitter();
		this.start()
	}

	async start(){
		await this.load_cache_data()
		//this.handel_sycile_end()
	}

	async load_cache_data(){
		var {cache}=await jsonfile.readFile(this.cache_file_path)
		console.log(cache)
		this.cache=cache;
	}

	async save_cache_file_data(){
		var file_object={
			cache:this.cache,
		}
	    try{
	      await jsonfile.writeFile(this.cache_file_path,file_object,{ spaces: 2, EOL: '\r\n' })
	    }catch(err){
	    	console.log(err)
	    }	
	}

	set_reserver(reserver,reserver_id){
		this.reservers[reserver_id]=new Object()
		this.reservers[reserver_id]['reserver']=reserver;
		this.reservers[reserver_id]['waiting_qu']={};
		this.reservers[reserver_id]['last_waiting_id']=0;
		this.reservers[reserver_id]['waiting_qu_count']=0;
		this.reservers[reserver_id]['in_get_recerjen']=false;
		this.handel_reserver_sycile_end(reserver_id)
	}

	get_next_reserver_id(){
		var reservers_ids=Object.keys(this.reservers);
		if(!this.last_reserver_id){
			this.last_reserver_id=reservers_ids[0]
			return this.last_reserver_id
		}
		if(this.last_reserver_id==reservers_ids[reservers_ids.length-1]){
			this.last_reserver_id=reservers_ids[0]
			return this.last_reserver_id
		}else{
			var index_of_last_reserver_id=reservers_ids.indexOf(this.last_reserver_id);
			index_of_last_reserver_id+=1;
			this.last_reserver_id=reservers_ids[index_of_last_reserver_id]
			return this.last_reserver_id	
		}
	}

	pay_sycle(id,code){
		return new Promise((res,rej)=>{
			var code_in_cache=this.get_code_from_cache(code)
			if(code_in_cache){return res({sucssess:true,err:false,status:'2'})}
			if(!code_in_cache){
				var id_in_get_ress_array=this.cheek_if_code_in_any_get_qu_and_return_ress_array(code)
				if(id_in_get_ress_array){
					id_in_get_ress_array.push(res)
				}else{
					var reserver_id=this.get_next_reserver_id()
					this.reservers[reserver_id]['last_waiting_id']++
					this.reservers[reserver_id]['waiting_qu'][`${this.reservers[reserver_id]['last_waiting_id']}`]={ress:[res],id:id,code:code,reserver:this.reservers[reserver_id]['reserver']}
					this.reservers[reserver_id]['waiting_qu_count']++
					if(!this.reservers[reserver_id]['in_get_recerjen']){
						this.events.emit(`${reserver_id}_sycil_end`)
					}
				}
			}
		})
	}

	cheek_if_code_in_any_get_qu_and_return_ress_array(code){
		for(var key in this.reservers){
			var code_in_qu_res=this.chek_if_code_in_qu(this.reservers[key]['waiting_qu'],code)
			if(code_in_qu_res){return code_in_qu_res}
		}
		return false
	}

	chek_if_code_in_qu(qu,code){
		for(var row_key in qu){
			if(qu[row_key]['code']==code){return qu[row_key]['ress']}
		}
		return false;		
	}

	get_code_from_cache(code){
		var code_row=this.cache.filter((cach_row)=>{
			return cach_row.code==code
		})
		if(!code_row[0]){return false}
		return true
	}

	async save_code_on_cach(code){
		console.log('in save_code_on_cach')
		try{
			this.cache.push({code:code})
			await this.save_cache_file_data()
		}catch(err){
			return new Error('save_code_on_cach')
		}
	}

	get_firest_key_of_syciles_qu(reserver_id){
		var keys=Object.keys(this.reservers[reserver_id]['waiting_qu'])
		if(keys.length>0){return keys[0]}else{return false}
	}

	handel_reserver_sycile_end(reserver_id){
		this.events.on(`${reserver_id}_sycil_end`,async()=>{
			var firest_sycile_key=this.get_firest_key_of_syciles_qu(reserver_id);
			if(firest_sycile_key){
				this.reservers[reserver_id]['in_get_recerjen']=true;
				var sycile_object=this.reservers[reserver_id]['waiting_qu'][firest_sycile_key];
				console.time(`time ${reserver_id}`);
				var neck_name=await this.get_sycile(sycile_object['id'],sycile_object['code'],sycile_object['reserver'])
				console.timeEnd(`time ${reserver_id}`);
				//sycile_object['res'](neck_name)
				for(var res of sycile_object['ress']){res(neck_name)}
				delete this.reservers[reserver_id]['waiting_qu'][firest_sycile_key];
				this.reservers[reserver_id]['waiting_qu_count']--
				this.events.emit(`${reserver_id}_sycil_end`)
			}else{
				this.reservers[reserver_id]['in_get_recerjen']=false;
			}
		})
	}




	async get_sycile(id,code,reserver){
		try{
			await this.fill_player_id(id,reserver)
			await this.click_enter(reserver)
			await this.delay(3000)			
			await this.fill_code(code,reserver)
			await this.click_on_ok_button(reserver)
			await this.solve_capatcha_if_exsesst(reserver)
			await this.click_on_send_button(reserver)
			await this.solve_capatcha_if_virefie_case(reserver)
			await this.cheek_if_error(reserver)
			await this.save_code_on_cach(code)
			await this.realod(reserver)
			console.log('done')
			return {sucssess:true,err:false,status:'5'}			
		}catch(err){
			console.log('error catch',err)
			await this.realod(reserver)
			return {sucssess:false,err:err,status:'4'}
		}
	}

	async log_in_ruteen(reserver_id,email,password){
		try{
			var reserver=this.reservers[reserver_id]['reserver'];
			await this.click_on_log_in_button(reserver)
			await this.delay(6000)
			await this.fill_email(reserver,email)
			await this.fill_password(reserver,password)
			await this.click_on_log_in_button_after_fill(reserver,password)
			await reserver.waitForNavigation({waitUntil: 'networkidle2'})
			console.log('loged in')
		}catch(err){
			console.log(err)
			return
		}
	}

	async click_on_log_in_button(reserver){
		console.log('in click_on_log_in_button')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('div.login-btn',{timeout:10000})
				var free_fire_button=await reserver.$('div.login-btn')
				await free_fire_button.click()
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in click_on_log_in_button')
			}			
		})
	}

	async click_on_log_in_button_after_fill(reserver){
		console.log('in click_on_log_in_button_after_fill')
		return new Promise(async(res,rej)=>{
			try{
				var frame = await reserver.frames().find(frame => frame.name() === 'iframe-window');
				await frame.click('.sign-in-btn')
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in click_on_log_in_button_after_fill')
			}			
		})
	}

	async fill_email(reserver,email){
		console.log('in fill_email')
		return new Promise(async(res,rej)=>{
			try{
				var frame = await reserver.frames().find(frame => frame.name() === 'iframe-window');
				await frame.click('[placeholder="يرجى إدخال صندوق البريد"]')
				await this.type_as_a_humen(reserver,email);
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in fill_email')
			}				
		})
	}

	async fill_password(reserver,password){
		console.log('in fill_password')
		return new Promise(async(res,rej)=>{
			try{
				var frame = await reserver.frames().find(frame => frame.name() === 'iframe-window');
				await frame.click('[placeholder="أدخِل كلمة السر"]')
				await this.type_as_a_humen(reserver,password);
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in fill_password')
			}				
		})
	}


	async fill_player_id(id,reserver){
		console.log('in fill_player_id')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('[placeholder="يرجى إدخال معرف اللاعب الخاص بك"]')
				var national_id_input=await reserver.$('[placeholder="يرجى إدخال معرف اللاعب الخاص بك"]')
				await national_id_input.click()
				await this.type_as_a_humen(reserver,id);
				res(true)
			}catch(err){
				rej('Error in fill_player_id')
			}				
		})
	}

	async fill_code(code,reserver){
		console.log('in fill_code')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('[placeholder="يرجى إدخال رمز استرداد"]')
				var national_id_input=await reserver.$('[placeholder="يرجى إدخال رمز استرداد"]')
				await national_id_input.click()
				await reserver.keyboard.type(code,{delay:0});
				res(true)
			}catch(err){
				rej('Error in fill_code')
			}				
		})
	}

	async click_enter(reserver){
		console.log(' in click_enter')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.keyboard.press('Enter');
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in click_enter')
			}			
		})
	}

	async click_on_ok_button(reserver){
		console.log(' in click_on_ok_button')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector("#app > div.content > div.x-main > div.redeem-box.email-box",{timeout:4000})
				var free_fire_button=await reserver.$("#app > div.content > div.x-main > div.redeem-box.email-box")
				await free_fire_button.click()
				//await this.delay(6000)
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in click_on_ok_button')
			}			
		})
	}

	async click_on_send_button(reserver){
		console.log(' in click_on_send_button')
		return new Promise(async(res,rej)=>{
			try{
				await this.delay(6000)
				await reserver.waitForSelector("#normal-button-group",{timeout:16000})
				var free_fire_button=await reserver.$("#normal-button-group")
				await free_fire_button.click()
				await this.delay(4000)
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in click_on_send_button')
			}			
		})
	}

	async click_on_verifi_button(reserver){
		console.log('in click_on_verifi_button')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('#flex-verify-button-group',{timeout:4000})
				var free_fire_button=await reserver.$('#flex-verify-button-group')
				await free_fire_button.click()
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in click_on_verifi_button')
			}			
		})
	}		

	async cheek_if_error(reserver){
		console.log('in cheek_if_error')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('.error-text',{timeout:16000})
				var error_text=await this.get_error_text(reserver)
				rej(error_text)
			}catch(err){
				console.log(err)
				res(true)
			}			
		})
	}

	async get_error_text(reserver){
		try{
			await this.delay(2000)
			var errorr_element=await reserver.$('.error-text')
			var text=await errorr_element.evaluate((node) => {
				try{
					console.log(node.textContent)	
					return node.textContent;
				}catch(err){return(false)}
			})
			return text
		}catch(err){
			return 'get_error_text'
		}

	}

	//_3mdCl_sRaO5vXGuGtdDqTO _3sYGlvN9b3AEZixLIfPEyv
	async log_in(reserver){
		console.log('in log_in')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('._3dEEQ_kZwLIozS6YAKJ2oO',{timeout:10000})
				var player_id_button=await reserver.$(`._3dEEQ_kZwLIozS6YAKJ2oO`)
				await player_id_button.click()
				res(true)
			}catch(err){
				console.log(err)
				res('Error in log_in')
			}			
		})
	}

	async log_in_after_solve(reserver){
		console.log('in log_in_after_solve')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('._3dEEQ_kZwLIozS6YAKJ2oO',{timeout:10000})
				var player_id_button=await reserver.$(`._3dEEQ_kZwLIozS6YAKJ2oO`)
				await player_id_button.click()
				await reserver.waitForNavigation()
				res(true)				
			}catch(err){
				rej('Error in log_in_after_solve')
			}
		})
	}	

	async cheek_if_capatcha(reserver){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('div#t_verify',{timeout:4000})
				res(true)
			}catch(err){
				res(false)
			}	
		})		
	}

	async cheek_if_virefi_case(reserver){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('#flex-verify-button-group',{timeout:4000})
				res(true)
			}catch(err){
				res(false)
			}	
		})		
	}

	async drage_to_x(reserver,x_point){
		console.log('in drage_to_x')
		return new Promise(async(res,rej)=>{
			try{
				var real_x=x_point-27.5;
				const iframe = await reserver.frames().find((frame) => frame.url().includes('https://t.captcha.qq.com/cap_union_new_show'));
				await iframe.waitForSelector('#tcaptcha_drag_button')
				var drage_button=await iframe.$('#tcaptcha_drag_button');
				const box = await drage_button.boundingBox();
				var move_to_x=(box.x + box.width / 2)+real_x;
				var move=box.x + box.width / 2;
				var move_to;
				await reserver.mouse.move(box.x + box.width / 2, box.y + box.height / 2);				
				await reserver.mouse.down();
				while(move<move_to_x){
					await this.delay(1)
					move+=1;
					await reserver.mouse.move(move, box.y + box.height / 2);
				}																	
				await reserver.mouse.up();
				await reserver.mouse.click(move_to_x, box.y + box.height / 2);
				res(true)
			}catch(err){
				console.log(err)
				rej('Error in drage_to_x',err)
			}
		})
	}	

	async solve_qq_capatcha(reserver){
		console.log('in solve_qq_capatcha')
		return new Promise(async(res,rej)=>{
			try{
				await this.delay(20000)
				const iframe = await reserver.frames().find((frame) => frame.url().includes('https://t.captcha.qq.com/cap_union_new_show'));
				await iframe.waitForSelector('#slideBg')
				var img_1_src=await iframe.$eval('#slideBg', img => img.src);
				var img_2_src=await iframe.$eval('img#slideBlock', img => img.src);
				var x=await global.manager_qq_capatcha.solve_sycile([img_1_src,img_2_src])
				await this.drage_to_x(reserver,x)
				var steel_theer_state=await this.cheek_if_capatcha_steel_theer_and_click_change_if_steel(reserver)
				if(steel_theer_state==true){
					await this.solve_qq_capatcha(reserver)
					res(true)
				}else{
					res(true)
				}
			}catch(err){
				console.log(err)
				res(false)
			}
		})
	}

	async cheek_if_capatcha_steel_theer_and_click_change_if_steel(reserver){
		console.log('in cheek_if_capatcha_steel_theer_and_click_change_if_steel')
		return new Promise(async(res,rej)=>{
			try{
				await this.delay(6000)
				const iframe = await reserver.frames().find((frame) => frame.url().includes('https://t.captcha.qq.com/cap_union_new_show'));
				if(iframe){
					await iframe.waitForSelector('#reload')
					var reload_button=await iframe.$('#reload')
					await reload_button.click()
					res(true)
				}else{
					res(false)
				}
			}catch(err){
				console.log(err)
				rej(true)
			}
		})
	}

	async solve_capatcha_if_exsesst(reserver){
		console.log('in solve_capatcha_if_exsesst')
		return new Promise(async(res,rej)=>{
			try{
				var capatcha_state=await this.cheek_if_capatcha(reserver)
				console.log(capatcha_state)
				if(capatcha_state){
					var solve_state=await this.solve_qq_capatcha(reserver)
					if(!solve_state){return res(false)}
					if(solve_state){return res(true)}
					res(false)
				}else{
					return res(true)
				}
			}catch(err){
				console.log(err)
				rej('Error in solve_capatcha_if_exsesst',err)
			}
		})
	}

	async solve_capatcha_if_virefie_case(reserver){
		console.log('in solve_capatcha_if_virefie_case')
		return new Promise(async(res,rej)=>{
			try{
				var virefi_case_state=await this.cheek_if_virefi_case(reserver)
				if(virefi_case_state){
					await this.click_on_verifi_button(reserver)
					var solve_state=await this.solve_qq_capatcha(reserver)
					if(!solve_state){return res(false)}
					if(solve_state){return res(true)}
					res(false)
				}else{
					return res(true)
				}
			}catch(err){
				console.log(err)
				rej('Error in solve_capatcha_if_virefie_case',err)
			}
		})
	}

    delay(time){
        return new Promise((res,rej)=>{
            setTimeout(()=>{res()},time)
        })
    }
	async type_as_a_humen(reserver,text){
		var wait_pariods=[5,10,15,13,22,10];
		for(var chracter of text){
			await this.delay(wait_pariods.random())
			await reserver.keyboard.type(chracter,{delay:0});
		}
	}

	async solve_text_capatch(reserver){
		console.log('solve_text_capatch')
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('img._3qmppU24pI7IrGzBFxsItc',{timeout:6000})
				var capatcha_img=await reserver.$('img._3qmppU24pI7IrGzBFxsItc')
				try{
					var base_64_photo=await reserver.evaluate(() => {
						try{
							var img=document.querySelector('img._3qmppU24pI7IrGzBFxsItc')
							var canvas = document.createElement('canvas');
							canvas.height = img.naturalHeight;
							canvas.width = img.naturalWidth;
							document.body.appendChild(canvas)
							var ctx =canvas.getContext('2d');
	  						ctx.drawImage(img, 0, 0);
	  						var base64String = canvas.toDataURL();
	  						return base64String;
						}catch(err){return(false)}
					})
					if(base_64_photo){
						var text_anwser=await this.get_text_capatcha_answer_by_base_64_string(base_64_photo)
						text_anwser=text_anwser.toLowerCase();
						await this.fill_capatcha_answer(reserver,text_anwser)
						await this.click_on_sure_button(reserver)
						res(true)
					}
				}catch(err){rej('Error in solve_text_capatch')}
			}catch(err){
				res(true)
			}
		})
	}

	fill_capatcha_answer(reserver,text){
		return new Promise(async(res,rej)=>{
			try{
				await reserver.waitForSelector('input._2sKyNNrNHK-oZIkAUg3gZu',{timeout:6000})
				var capatcha_input=await reserver.$('input._2sKyNNrNHK-oZIkAUg3gZu')
				await capatcha_input.click()
				await this.type_as_a_humen(reserver,text);
				res(true)
			}catch(err){
				rej('Error in fill_capatcha_answer')
			}				
		})		
	}

	async get_text_capatcha_answer_by_base_64_string(streeng){
		var form = new FormData();
		form.append('key', '4628c8a5502d2ce831730b7e044beef8');
		form.append('body', streeng);	
		form.append('method', 'base64');
		form.append('regsense', 1);
 		var response = await fetch(
	 			`http://2captcha.com/in.php?`,{
				method: 'POST',         
				body: form
			}
		);
		var data = await response.text()
		var id_state=data.slice(0,2)
		if(id_state=='OK'){
			var id=data.slice(3);
			var object=await this.get_anwer_recerjen(id,'3e50f40f00ea2e831458e6734cb07a0a')
			if(object.state=='solved'){
				return object.text
			}
		}	
	}

	async get_anwer_recerjen(id,key){
			console.log('get recerjen')
			await this.delay(2000)
			var responde = await fetch(
					`https://2captcha.com/res.php?key=${key}&action=get&id=${id}&json=1`,{
					method: 'POST',  
				}
			);
			var answer_object= await responde.json()
			if(answer_object.status==1){
				return {state:'solved',text:answer_object.request}
			}else{
				switch(answer_object.request){
					case 'CAPCHA_NOT_READY':
						return await this.get_anwer_recerjen(id,key)
						break
					case 'ERROR_CAPTCHA_UNSOLVABLE':
					case 'ERROR_BAD_DUPLICATES':
						return {state:'unsolved',action:'re_post'}
						break	
					default:
					    return {state:'unsolved',action:'stop'}							
				}
			}

	} 
	   
 	async realod(reserver){
 		console.log('in reload')
 		try{
			await reserver.goto('https://www.midasbuy.com/midasbuy/sa/redeem/pubgm',{waitUntil: 'load', timeout: 0});
 		}catch(err){
 			console.log('error in reload',err)
 		}

	}	   

}

//mJJLJFhk2b2444K8Bd
//mJJLJmhd2D2140K9C4
//mJJLJfhj2e2a46K0D4
//mJJLJXhj2H2f4bKdEb
//5421181721
//5421181721
//51338094177
//mJJLJFhk2b2444K8Bd
//R6SZVT
//https://gop.captcha.garena.com/image?key=172deb2f-2f33-41cf-be1f-b15f5ecaa865
//https://as7abcard.com/pubg-files/freefire.php?action=getPlayerName&game=freefire&playerID=2506885218

module.exports= new Manager_pubgy

//_0x4ed3d0=[]
//https://shop2game.com/app/100067/login?next=/app/100067/buy/0

//https://shop2game.com/app/100067/idlogin?next=/app/100067/buy/0
