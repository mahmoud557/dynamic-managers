var fetch = require('node-fetch');
var fs = require('fs');
var {parse} = require('node-html-parser');
function delay(time){
	return new Promise((res,rej)=>{
		setTimeout(()=>{res()},time)
	})
}

(async()=>{

	var z={
        69903: function(t, e, n) {
            "use strict";
            
            var i = n(7914);
           
            Object.defineProperty(e, "__esModule", {
                value: !0
            })

             e.xMidasEncrypt = function(e) {
                
                var t = JSON.stringify((0, r.default)(e, function(t) {
                        return void 0 !== t && 'object' != typeof t ? String(t) : t
                    })),

                    
                    n = document.getElementById('xMidasToken').value;
                
                if (!n) return e;
                
                var i = document.getElementById('xMidasVersion').value,
                    
                    o = a(function() {
                        try {
                            return window.xMidas({
                                d: t
                            })
                        } catch (t) {
                            return e
                        }
                    });

                return o.result ? (
		                s('xmidas.encrypt', { times: o.times})
		                , {
		                    encrypt_msg: function(t) {
		                        return btoa(String.fromCharCode.apply(String, t.match(/../g).map(function(t) {
		                            return parseInt(t, 16)
		                        })))
		                    }(o.result),
		                    ctoken_ver: i,
		                    ctoken: n
		                }
	                ):(
	                s('xmidas.error', {times: o.times})
                    ,e
                    )
            }, e.xMidasInit = function() {
                var t;
                if (null === (t = document.getElementById('xMidasToken')) || void 0 === t || !t.value) return s('xmidas.no.token');
                try {
                    var e = a(function() {
                            return window.xMidas()
                        }),
                        n = e.result || [];
                    s('xmidas.init', {
                        times: e.times
                    }), 0 < n.length && s('xmidas.init.result', {
                        result: n.join(',')
                    })
                } catch (t) {}
            }, n(61013), n(52077), n(1203), n(32081), n(25613);
            
            var r = i(n(9411));

            function a(t) {
                var e = Date.now(),
                    t = t();
                return {
                    times: Date.now() - e,
                    result: t
                }
            }

            var s = function(t, e) {
                var n;
                return (n = window.report) && 'function' == typeof n.custom ? n.custom(t, e) : 'function' == typeof n ? n("midasbuy.custom." + t, e) : void 0
            }
        }
	}
	
	//console.log(z.encrypt_msg)

})()
/*
{
    "errorCode": "0",
    "randstr": "@x3n",
    "ticket": "t03F3cajPxdmgR8XZG20i_fkx4XfxBnhitbZUEVNiHVtMzy1nDZPk93FzD2mcAO7krLUX2vGVRZNLMYNwqngSlMFZDbzjJ-Dx3OJN6meG2QocjiLRKkKG9S9A**",
    "errMessage": "",
    "sess": ""
}
*/



//https://shop2game.com/app/
//808306716