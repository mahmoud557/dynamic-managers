var fetch = require('node-fetch');
var {Headers} = require('node-fetch');
var fs = require('fs');
const FormData = require('form-data');
var {parse} = require('node-html-parser');
function delay(time){
	return new Promise((res,rej)=>{
		setTimeout(()=>{res()},time)
	})
}

async function get_anwer_recerjen(id,key){
	await delay(2000)
	console.log(answer)		
	var answer = await fetch("https://www.jawaker.com/ar/buy/tokens/m_vouchers", {
		  "headers": {
		    "accept": "*/*",
		    "accept-language": "en-US,en;q=0.9",
		    "content-type": "application/x-www-form-urlencoded",
		    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
		    "sec-ch-ua-mobile": "?0",
		    "sec-ch-ua-platform": "\"Windows\"",
		    "sec-fetch-dest": "empty",
		    "sec-fetch-mode": "cors",
		    "sec-fetch-site": "same-origin",
		    "x-csrf-token": "1/1/IwmDmqRNwf8NlF5yiFJlu0Y7H01WQ8ypMCfJiT9Axo1L/gWdOM+QSXSoWOhTTvakSBkE6g7ijV2HcKHysA==",
		    "x-newrelic-id": "VwQBWVdACwIJVFFQ",
		    "x-requested-with": "XMLHttpRequest",
		    "cookie": "locale=ar; show_app_overlay=show; _jawaker_session=6a0a28d5e05d15bf32423af2f59b0f2a; __cf_bm=Do7Ir58iDUGy_sAk5iU9yUcJp7rJjBIPcvdyXMObTHk-1648064502-0-AX9Xaf0YE9AbxeawLhq3ZBvCIYQFNHiRyMwKQdnnDYnUndMc8Y+v/zWHFYc2FWow3mBuuhz77lXCQKtZ6Zls9rM=; _ga=GA1.2.5702776.1648064502; _gid=GA1.2.711003261.1648064502; _vwo_uuid_v2=D2511C3941B74D0769585BCD788CE7F51|26d8c5fd66bde8dd1f02359f55815598; pseudoid=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ik5UZ3hOVEl6TmpZMSIsImV4cCI6IjIwMjQtMDMtMjNUMTk6NDg6NDkuNDczWiIsInB1ciI6bnVsbH19--c444c9584dcb7a8d8014c8079e58a9a10c1e6763",
		    "Referer": "https://www.jawaker.com/ar/code",
		    "Referrer-Policy": "strict-origin-when-cross-origin"
		  },
		  "body": "player_number=1277301568&pin_code=R161J653RKKQ",
		  "method": "POST"
		});
	answer= await answer.text()
	console.log(answer)
}

(async()=>{
	var answer = await fetch("https://www.jawaker.com/ar/buy/tokens/m_vouchers", {
		  "headers": {
		    "accept": "*/*",
		    "accept-language": "en-US,en;q=0.9",
		    "content-type": "application/x-www-form-urlencoded",
		    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
		    "sec-ch-ua-mobile": "?0",
		    "sec-ch-ua-platform": "\"Windows\"",
		    "sec-fetch-dest": "empty",
		    "sec-fetch-mode": "cors",
		    "sec-fetch-site": "same-origin",
		    "x-csrf-token": "1/1/IwmDmqRNwf8NlF5yiFJlu0Y7H01WQ8ypMCfJiT9Axo1L/gWdOM+QSXSoWOhTTvakSBkE6g7ijV2HcKHysA==",
		    "x-newrelic-id": "VwQBWVdACwIJVFFQ",
		    "x-requested-with": "XMLHttpRequest",
		    "cookie": "locale=ar; show_app_overlay=show; _jawaker_session=6a0a28d5e05d15bf32423af2f59b0f2a; __cf_bm=Do7Ir58iDUGy_sAk5iU9yUcJp7rJjBIPcvdyXMObTHk-1648064502-0-AX9Xaf0YE9AbxeawLhq3ZBvCIYQFNHiRyMwKQdnnDYnUndMc8Y+v/zWHFYc2FWow3mBuuhz77lXCQKtZ6Zls9rM=; _ga=GA1.2.5702776.1648064502; _gid=GA1.2.711003261.1648064502; _vwo_uuid_v2=D2511C3941B74D0769585BCD788CE7F51|26d8c5fd66bde8dd1f02359f55815598; pseudoid=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ik5UZ3hOVEl6TmpZMSIsImV4cCI6IjIwMjQtMDMtMjNUMTk6NDg6NDkuNDczWiIsInB1ciI6bnVsbH19--c444c9584dcb7a8d8014c8079e58a9a10c1e6763",
		    "Referer": "https://www.jawaker.com/ar/code",
		    "Referrer-Policy": "strict-origin-when-cross-origin"
		  },
		  "body": "player_number=1277301568&pin_code=PMG6MLRNM4QA",
		  "method": "POST"
		});
	
	answer= await answer.json()
	console.log(answer)
})()



//https://shop2game.com/app/
//808306716