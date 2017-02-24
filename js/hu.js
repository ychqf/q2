(function(){
	window.onmousemove = function(){
		return false
	}



	
	var wrap = document.getElementById("HQ_wrap");
	var header = document.querySelector("#HQ_wrap .header");
	var audio = document.querySelector("#HQ_wrap .audio");
	var scoll = 0;
	var now = 0;
	var nowMusic = null;
	
	leftMusicList()//生成数据
	
	var first = wrap.querySelector('.content .list li').children[1].children[0];
	
	fnObjMove(header,wrap);
	fnZhankai();
	listOpen();
	rightGunlun()
	carouselImg()
	right2zhankai()
	palySuspend()//音乐播放和暂停
	valget()//音量变大变小
	musicClick()//左边列表点击
	
	huanyipi()//需求函数 换一批切换
	
	
	//需求函数0，生成数据
	function leftMusicList(){
		fn1()//生成左侧音乐列表
		fn2()//生成轮播图
		fn3()//生成右侧列表单曲
		//生成左侧音乐列表
		function fn1(){
			var list =wrap.querySelector('.content .list');
			var musiclist = data.musiclist;
			musiclist.forEach(function(item,i){
				var li = document.createElement('li');
				var h3 = document.createElement('h3');
				h3.innerHTML = item.title+'<span class="iconfont">&#xe662;</span>';
				
				var ul = document.createElement('ul');
				var text = item.text;
				
				text.forEach(function(item,i){
					var li2 = document.createElement('li');
					li2.innerHTML = item.nane;
					li2.setAttribute('_img',item.img);
					li2.setAttribute('_src',item.src);
					ul.appendChild(li2);
				})
				
				li.appendChild(h3);
				li.appendChild(ul);
				list.appendChild(li);
			})
		}
		
		
		//生成轮播图
		function fn2(){
			var imgBox = wrap.querySelector('#HQ_wrap .carouselBox .imgBox');
			var imgs = data.lunImg;
			imgs.forEach(function(item,i){
				var img = document.createElement('img');
				img.setAttribute('src',item.src);
				img.setAttribute('_href',item.href);
				imgBox.appendChild(img);
			})
		}
		
		
		//生成右侧列表单曲
		function fn3(){
			var newMusic = wrap.querySelector('#HQ_wrap .rightContent .newMusic ul');
			var bestDance = wrap.querySelector('#HQ_wrap .rightContent .bestDance ul');
			var sutraMusic = wrap.querySelector('#HQ_wrap .rightContent .sutraMusic ul');
			fn4(newMusic,'zxdq');
			fn4(bestDance,'jbdj');
			fn4(sutraMusic,'jdjq');
			function fn4(a,b){
				var lis = data[b];
				for(var i=0;i<8;i++){
					var li = document.createElement('li');
					li.setAttribute('_src',lis[i].src);
					li.setAttribute('_img',lis[i].img);
					var src = lis[i].nane;
					var arr4 = src.split('-');
					li.innerHTML = `
									<div>
										<img src="${lis[i].img}">
										<span class="iconfont">&#xe611;</span>
									</div>
									<p>${arr4[0]}</p>
									<p>${arr4[1]}</p>
									`
					a.appendChild(li);
				}
			}
				
		}
	}
	//需求函数1，移动
	function fnObjMove(obj1,obj2){
		obj1.onmousedown = function(ev){
			var divX = ev.pageX - obj2.offsetLeft;
			var divY = ev.pageY - obj2.offsetTop;
			window.onmousemove = function(ev){
				var l = ev.pageX - divX;
				var t = ev.pageY - divY;
				if(l<0){
					l=0;
				}
				
				if(l>window.innerWidth - obj2.offsetWidth){
					l=window.innerWidth - obj2.offsetWidth;
				}
				if(t<0){
					t=0;
				}
				
				if(t>window.innerHeight - obj2.offsetHeight){
					t=window.innerHeight - obj2.offsetHeight;
				}
				obj2.style.left = l + 'px';
				obj2.style.top = t + 'px';
				
				return false;
			}
			window.onmouseup = function(){
				
				window.onmousemove = null;
				obj1.onkeydown = null;
				
			}
			ev.cancelBubble = true;
		}
	}
	
	//需求函数2，板块展开
	function fnZhankai(){
		var zhankai = wrap.querySelector('#HQ_wrap .header div .zhankai');
		var navBox = wrap.querySelector('#HQ_wrap .footer .navBox');
		zhankai.addEventListener('click',fn1)
		function fn1(ev){
			if(wrap.offsetWidth <=230){
				mTween(wrap,{width:783},300,'easeOut')
				//wrap.style.width = '783px';
				navBox.style.display = 'block';
				fnTimerShow()
			}else{
				mTween(wrap,{width:230},300,'easeOut')
				//wrap.style.width = '230px';
				navBox.style.display = 'none';
				fnTimerHid()
			}
			ev.stopPropagation();
		}
		function fnTimerShow(){
			var time = wrap.querySelector('#HQ_wrap .time');
			var content = wrap.querySelector('#HQ_wrap .content');
			var time2 = wrap.querySelector('#HQ_wrap .footer .time2');
			content.style.height = '458px'
			time.style.height = '0px';
			time.style.opacity = 0;
			time2.style.height = '500px';
			time2.style.opacity = 1;
		}
		
		function fnTimerHid(){
			var time = wrap.querySelector('#HQ_wrap .time');
			var content = wrap.querySelector('#HQ_wrap .content');
			var time2 = wrap.querySelector('#HQ_wrap .footer .time2');
			content.style.height = '438px'
			time.style.height = '20px';
			time2.style.height = '0px';
			time.style.opacity = 1;
			time2.style.opacity = 0;
		}
		return false
	}
	
	
	//需求函数3，列表展开
	function listOpen(){
		var h3s = wrap.querySelectorAll('.content .list h3');
		var content = wrap.querySelectorAll('.content')[0];
		var list = content.querySelectorAll('.list')[0];
		h3s = Array.from(h3s);
		h3s.forEach(function(item,i){
			item.setAttribute('now',false)
			item.onclick = function(){
				var ul = item.nextElementSibling;
				if(item.now){
					ul.style.display = 'none';
				}else{
					ul.style.display = 'block';
					list.style.top = list.offsetTop - 40 + 'px';
				}
				item.now = !item.now;
				
				var contentScoll = list.scrollHeight - content.offsetHeight;
				if(-list.offsetTop>contentScoll&&contentScoll>0){
					list.style.top = -contentScoll + 'px';
				}
				if(contentScoll<0){
					list.style.top = 0 + 'px';
				}
				
				roll()
				dianMove()
				musicListGun()
				return false
			}
		})
		return false
	}

	//需求函数4，列表的滚轮事件
	function musicListGun(){
		var content = wrap.querySelector('.content');
		var list = content.querySelector('.list');
		Gunlun(content,list,function(){
			roll()
			dianMove()
		});
	}
	//需求函数4，播放列表的自定义滚动条的消失与隐藏
	function roll(){
		var content = wrap.querySelectorAll('.content')[0];
		var list = content.querySelectorAll('.list')[0];
		var roll = content.querySelectorAll('.roll')[0];
		var dian = roll.querySelectorAll('.dian')[0];
		//console.log(content,list)
		
		
		var cH = content.offsetHeight;
		var lH = list.scrollHeight;

		if(lH>cH){
			roll.style.display = 'block';
		}else{
			roll.style.display = 'none';
		}
	}
	
	//需求函数5，自定义滚动条的拖拽；
	function dianMove(){
		var content = wrap.querySelectorAll('.content')[0];
		var list = content.querySelectorAll('.list')[0];
		var roll = content.querySelectorAll('.roll')[0];
		var dian = roll.querySelectorAll('.dian')[0];


		var contentScoll = list.scrollHeight - content.offsetHeight;
		
		var hh2 = roll.offsetHeight - dian.offsetHeight;
		dian.style.top = -(list.offsetTop/contentScoll)*hh2 +'px';

		dian.addEventListener('mousedown',fnDown)

		function fnDown(ev){
			var divY = ev.pageY - dian.offsetTop;
			document.addEventListener('mousemove',fnMove);

			function fnMove(ev){
				var l = ev.pageY - divY;
				if(l<=0){
					l=0;
				}
				if(l>roll.offsetHeight - dian.offsetHeight){
					l = roll.offsetHeight - dian.offsetHeight;
				}

				dian.style.top = l + 'px';

				var scoll = l/(roll.offsetHeight - dian.offsetHeight);

				list.style.top = -contentScoll*scoll + 'px';
				ev.preventDefault()
			}

			document.addEventListener('mouseup',fnUp)

			function fnUp(){
				document.removeEventListener('mousemove',fnMove);
				document.removeEventListener('mouseup',fnUp)
			}
			ev.preventDefault()
		}
		
	}

	//需求函数6：图片轮播
	function carouselImg(){
		var carouselBox = wrap.querySelector('#HQ_wrap .carouselBox');
		var imgBox = wrap.querySelector('#HQ_wrap .carouselBox .imgBox');
		//console.log(imgBox);

		var prev = wrap.querySelector('#HQ_wrap .carouselBox .prev');
		var next = wrap.querySelector('#HQ_wrap .carouselBox .next');

		var timer = 0;

		var imgs = imgBox.children;
		imgs = Array.from(imgs);
		var arr = [];

		imgs.forEach(function(item,i){
			item.onclick = function(){
				window.open(item.getAttribute('_href'));
			}
			var obj = {};
			obj.left = css(item,'left');
			obj.top = css(item,'top');
			obj.height = css(item,'height');
			obj.width = css(item,'width');
			obj.opacity = css(item,'opacity');
			obj.zIdext = css(item,'z-index');
			
			arr.push(obj)
		})

		
		prev.addEventListener('click',fn1)
		next.addEventListener('click',fn2)

		function fn1(){
			prev.removeEventListener('click',fn1)
			arr.unshift(arr.pop());
			arr.forEach(function(item,i){
				imgs[i].style.zIndex = arr[i].zIdext;
				mTween(imgs[i],{
					left:arr[i].left,
					top:arr[i].top,
					height:arr[i].height,
					width:arr[i].width,
					opacity:arr[i].opacity
				},500,function(){
					prev.addEventListener('click',fn1);
				})
			})

		}

		function fn2(){
			next.removeEventListener('click',fn2)
			arr.push(arr.shift());
			arr.forEach(function(item,i){
				imgs[i].style.zIndex = arr[i].zIdext;
				mTween(imgs[i],{
					left:arr[i].left,
					top:arr[i].top,
					height:arr[i].height,
					width:arr[i].width,
					opacity:arr[i].opacity
				},500,function(){
					next.addEventListener('click',fn2);
				})
			})
			
		}

		clearInterval(timer);
		timer = setInterval(function(){
			fn2();
		},2500);

		carouselBox.onmouseover = function(){
			clearInterval(timer);
		}
		carouselBox.onmouseout = function(){
			clearInterval(timer);
			timer = setInterval(function(){
				fn2();
			},2500);
		}

	}


	
	//需求函数7：右侧列表板块 滚轮改变位置
	function rightGunlun(){
		var right = wrap.querySelector('#HQ_wrap .right');
		var rightBox = right.querySelector('.rightBox');
		Gunlun(right,rightBox)
	}

	//需求函数8 音乐播放弧形进度条
	function CDzhuan(b){
		var leftRot = wrap.querySelector('.right2 .CD .load_left span'),
		    rightRot = wrap.querySelector('.right2 .CD .load_right span');
		    
		var a = Math.floor(b*360*100)/100;	
		
	  	if (a <= 180) {
	    	rightRot.style.transform = 'rotate(' + a + 'deg)';
	    	leftRot.style.transform = 'rotate(0deg)';
	  	}
	  	if (a>180) {
	    	leftRot.style.transform = 'rotate(' + (a - 180) + 'deg)';
	    	rightRot.style.transform = 'rotate(180deg)';
	  	}
	  	
	}

	//需求函数9；cd 照片旋转
	function cdImgZhuan(a){
		var inner = wrap.querySelector('.right2 .CD .inner');
		//var now = 0;
		if(!a){
			now++
		}
		inner.style.transform = 'rotate(' + now/2 + 'deg)';
	}

	//需求函数10：右侧唱片板块渐隐渐现
	function right2zhankai(){
		var cd2 = wrap.querySelector('.footer .navBox .CD');
		var right2 =  wrap.querySelector('.right2');
		right2.style.display = 'none';
		//console.log(cd2)
		cd2.addEventListener('click',fn1)
		function fn1(){
			if(right2.style.display == 'none'){
				right2.style.display = 'block';
				mTween(right2,{opacity:100},400,'linear')
			}else{
				mTween(right2,{opacity:0},400,'linear',function(){
					right2.style.display = 'none';
				})
			}
		}
	}

	//需求函数11：音量变大变小
	valget()
	function valget(){
		var val = wrap.querySelector('.footer .navBox .volumeBox .volume');
		var tiao = wrap.querySelector('.footer .navBox .volumeBox .tiao');
		var dian = wrap.querySelector('.footer .navBox .volumeBox .tiao .dian');

		var now = false;
		val.onclick = function(){
			tiao.style.display = 'block';
		}

		dian.addEventListener('mousedown',fnDown)

		function fnDown(ev){
			var divY = ev.pageY - dian.offsetTop;
			document.addEventListener('mousemove',fnMove);

			function fnMove(ev){
				var l = ev.pageY - divY;
				if(l<=0){
					l=0;
				}
				if(l>tiao.offsetHeight - dian.offsetHeight){
					l = tiao.offsetHeight - dian.offsetHeight;
				}

				dian.style.top = l + 'px';

				var scoll = l/(tiao.offsetHeight - dian.offsetHeight);
				audio.volume = 1-scoll;
				//console.log(scoll);
				ev.preventDefault()
			}

			document.addEventListener('mouseup',fnUp)

			function fnUp(){
				document.removeEventListener('mousemove',fnMove);
				document.removeEventListener('mouseup',fnUp);
				setTimeout(function(){
					tiao.style.display = 'none';
				},200)
			}
			ev.preventDefault()
		}

	}
	
	//需求函数12 音乐播放和暂停；
	function palySuspend(){
		var play = wrap.querySelector("#HQ_wrap .playBox .play");
		var suspend = document.querySelector("#HQ_wrap .playBox .suspend");

		play.onclick = function(){
			this.style.display = 'none';
			audio.play();
			suspend.style.display = 'inline-block';
			clearInterval(timer);
			timer = setInterval(timebian,100)
		}
		suspend.onclick = function(){
			this.style.display = 'none';
			audio.pause();
			play.style.display = 'inline-block';
			clearInterval(timer);
		}
		
	}
	
	//需求函数13 长进度变化
	function jindutiao(a){
		var jindu = wrap.querySelector('.time .jindu');
		var tiao = wrap.querySelector('.time .jindu .tiao');
		var dian = wrap.querySelector('.time .jindu .dian');
		
		var jindu2 = wrap.querySelector('.time2 .jindu');
		var tiao2 = wrap.querySelector('.time2 .jindu .tiao');
		var dian2 = wrap.querySelector('.time2 .jindu .dian');
		
		var w = jindu.offsetWidth
		var w2 = jindu2.offsetWidth;
		
		//console.log(w2)
		tiao2.style.width = a*w2 + 'px';
		dian2.style.left = a*w2 + 'px';
		
		tiao.style.width = a*w + 'px';
		dian.style.left = a*w + 'px';
		
	}
	
	//需求函数 点击左侧列表播放；
	function musicClick(){
		var list = wrap.querySelector('.content .list');
		var arr = [];
		var lis = list.children;
		lis = Array.from(lis);
		
		lis.forEach(function(item,i){
			var list2 = item.getElementsByTagName('ul')[0];
			var liss = list2.children;
			liss = Array.from(liss);
			liss.forEach(function(item,i){
				arr.push(item);
			})
		})
		
		arr.forEach(function(item,i){
			item.ondblclick = function(){
				arr.forEach(function(item,i){
					item.className = '';
				})
				musicAlter(item);
				clearInterval(timer);
				timer = setInterval(timebian,100)
			}
		})
	}
	
	musicClick2()
	function musicClick2(){
		var list = wrap.querySelector('#HQ_wrap .rightContent');
		var arr = [];
		var lis = list.children;
		lis = Array.from(lis);
		
		lis.forEach(function(item,i){
			var list2 = item.getElementsByTagName('ul')[0];
			var liss = list2.children;
			liss = Array.from(liss);
			liss.forEach(function(item,i){
				arr.push(item);
			})
		})
		
		arr.forEach(function(item,i){
			item.ondblclick = function(){
				clearInterval(timer);
				musicAlter(item);
				timer = setInterval(timebian,100)
			}
		})
	}

	
	//需求函数15；音乐时间的显示 进度显示：
	var nowtimeText = wrap.querySelector("#HQ_wrap .footer .time2 .nowTime");
	var timeslengthText = wrap.querySelector("#HQ_wrap .footer .time2 .timesLength");
	var timer = 0;
	/*
	clearInterval(timer);
	timer = setInterval(timebian,100)
	*/
	function timebian(){
		var nowtime = Math.floor(audio.currentTime);
		var timeslength = Math.floor(audio.duration);
		var yesOrNo = audio.paused;
		
		if(nowtime/timeslength){
			scoll = nowtime/timeslength;
		}
		var fen = Math.floor(nowtime/60)
		var miao = Math.floor(nowtime%60)
		if(miao<10){
			miao = '0' + miao;
		}
		nowtimeText.innerHTML = `${fen}:${miao}`
		
		var zongfen = Math.floor(timeslength/60)
		var zongmiao = Math.floor(timeslength%60)
		
		if(zongmiao){
			if(zongmiao<10){
				zongmiao = '0' + zongmiao;
			}
			timeslengthText.innerHTML = `${zongfen}:${zongmiao}`;
		}else{
			timeslengthText.innerHTML ='00:00';
		}
		
		CDzhuan(scoll)
		jindutiao(scoll)
		cdImgZhuan(yesOrNo);
	}
	//需求函数,滚轮事件兼容
	function myWheel(obj,callback){
		if(window.navigator.userAgent.toLowerCase().indexOf('firefox')!= -1){
			obj.addEventListener('DOMMouseScroll',fn1)
		}else{
			obj.addEventListener('mousewheel',fn1)
		}
		
		function fn1(ev) {
			var down = true;
			if(ev.wheelDelta){
				down = ev.wheelDelta>0?true:false;
			}else{
				down = ev.detail<0?true:false;
			}
			if(callback && typeof callback == 'function'){
				callback(down);
			}
			ev.preventDefault();
		}
	}
	
	//需求函数:滚轮事件
	function Gunlun(a,b,c){
		a.addEventListener('mouseover',fn1);

		function fn1(){
			myWheel(a,function(o){
				var t = b.offsetTop;
				if(o){
					t += 80;
					if (t>0){
						t = 0;
					}
				}else{
					t -= 80;
					if(t<a.offsetHeight - b.scrollHeight){
						t=a.offsetHeight - b.scrollHeight;
					}
				}
				b.style.top = t +'px';
				if(c){
					c();
				}
			})
		}
	}
	
	
	//需求函数:上一曲下一曲
	preNext()
	function preNext(){
		var pre = wrap.querySelector("#HQ_wrap .footer .playBox .prev");
		var next = wrap.querySelector("#HQ_wrap .footer .playBox .next");

		pre.onclick = function(){
			nowMusic.className = '';
			if(nowMusic){
				if(nowMusic.previousElementSibling){
					musicAlter(nowMusic.previousElementSibling)
				}else{
					musicAlter(nowMusic.parentNode.lastElementChild)
				}
			}else{
				musicAlter(first);
			}
			clearInterval(timer);
			timer = setInterval(timebian,100)
		}
		next.onclick = function(){
			if(nowMusic){
				nowMusic.className = '';
				if(nowMusic.nextElementSibling){
					musicAlter(nowMusic.nextElementSibling)
				}else{
					musicAlter(nowMusic.parentNode.firstElementChild)
				}
			}else{
				musicAlter(first);
			}
			clearInterval(timer);
			timer = setInterval(timebian,100)
		}
	}
	
	
	//需求函数:音乐切换
	function musicAlter(a){
		var img1 = wrap.querySelector("#HQ_wrap .right2 .right2Bj");
		var img2 = wrap.querySelector("#HQ_wrap .right2 .CD .inner .musicImg");
		a.className = 'active';
		if(a.offsetHeight>40){
			a.className = '';
		}
		audio.pause();
		audio.src = a.getAttribute('_src');
		audio.play();
		img1.src = img2.src = a.getAttribute('_img');
		var play = wrap.querySelector("#HQ_wrap .playBox .play");
		var suspend = document.querySelector("#HQ_wrap .playBox .suspend");
		play.style.display = 'none';
		suspend.style.display = 'inline-block';
		nowMusic = a;
		clearInterval(timer);
		timer = setInterval(timebian,100)
	}
	
	//需求函数  音乐进度条拖拽
	jinduGai()
	function jinduGai(){
		var jindu = wrap.querySelector('.time2 .jindu');
		var tiao = wrap.querySelector('.time2 .jindu .tiao');
		var dian = wrap.querySelector('.time2 .jindu .dian');
		
		dian.addEventListener('mousedown',fnDown)

		function fnDown(ev){
			clearInterval(timer);
			audio.pause();
			var divX = ev.pageX - dian.offsetLeft;
			document.addEventListener('mousemove',fnMove);

			function fnMove(ev){
				var l = ev.pageX - divX;
				if(l<=0){
					l=0;
				}
				if(l>jindu.offsetWidth - dian.offsetWidth){
					l = jindu.offsetWidth - dian.offsetWidth;
				}

				tiao.style.width = dian.style.left = l + 'px';
				ev.preventDefault()
				
				audio.currentTime = l/(jindu.offsetWidth - dian.offsetWidth)*audio.duration;
			}

			document.addEventListener('mouseup',fnUp)

			function fnUp(){
				//audio.currentTime = 20;
				var play = wrap.querySelector("#HQ_wrap .playBox .play");
				var suspend = document.querySelector("#HQ_wrap .playBox .suspend");
				play.style.display = 'none';
				suspend.style.display = 'inline-block';
				audio.play();
				timer = setInterval(timebian,100)
				document.removeEventListener('mousemove',fnMove);
				document.removeEventListener('mouseup',fnUp)
			}
			ev.preventDefault()
		}
	}
	
	
	//需求函数 换一批切换;
	function huanyipi(){
		var newMusic = wrap.querySelector('#HQ_wrap .rightContent .newMusic');
		var bestDance = wrap.querySelector('#HQ_wrap .rightContent .bestDance');
		var sutraMusic = wrap.querySelector('#HQ_wrap .rightContent .sutraMusic');
		
		var newMusicUl = newMusic.getElementsByTagName('ul')[0];
		var bestDanceUl = bestDance.getElementsByTagName('ul')[0];
		var sutraMusicUl = sutraMusic.getElementsByTagName('ul')[0];
		
		var newMusicSpan = newMusic.querySelector('header span');
		var bestDanceSpan = bestDance.querySelector('header span');
		var sutraMusicSpan = sutraMusic.querySelector('header span');
		
		//console.log(newMusicSpan,bestDanceSpan,sutraMusicSpan)
		var ne = data.zxdq;
		var be = data.jbdj;
		var su = data.jdjq;
		
		click(newMusicSpan,newMusicUl,ne);
		click(bestDanceSpan,bestDanceUl,be);
		click(sutraMusicSpan,sutraMusicUl,su);
		
		function click(aa,bb,cc){
			aa.onclick = fn1
			function fn1(){
				aa.onclick = null;
				cc.sort(function(e,f){
					return Math.random()-0.5
				})
				
				mTween(bb,{opacity:0},400,'easeOut',function(){
					bb.innerHTML = '';
					for(var i=0;i<8;i++){
						var li = document.createElement('li');
						li.setAttribute('_src',cc[i].src);
						li.setAttribute('_img',cc[i].img);
						var src = cc[i].nane;
						var arr4 = src.split('-');
						li.innerHTML = `
										<div>
											<img src="${cc[i].img}">
											<span class="iconfont">&#xe611;</span>
										</div>
										<p>${arr4[0]}</p>
										<p>${arr4[1]}</p>
										`
						bb.appendChild(li);
					}
					mTween(bb,{opacity:100},400,'easeOut',function(){
						aa.onclick = fn1;
						musicClick2()
					});
				})
	
			}
		}
			
		//关闭窗口
		close()
		function close(){
			var close = wrap.querySelector('#HQ_wrap .header div .close')
			close.onclick = function(){
				
				mTween(wrap,{opacity:0},800,'easeOut',function(){
					if(wrap.offsetWidth>235){
						wrap.style.width = '230px';
						
						var time = wrap.querySelector('#HQ_wrap .time');
						var content = wrap.querySelector('#HQ_wrap .content');
						var time2 = wrap.querySelector('#HQ_wrap .footer .time2');
						content.style.height = '438px'
						time.style.height = '20px';
						time2.style.height = '0px';
						time.style.opacity = 1;
						time2.style.opacity = 0;
					}
					audio.pause();
					clearInterval(timer);
					var play = wrap.querySelector("#HQ_wrap .playBox .play");
					var suspend = document.querySelector("#HQ_wrap .playBox .suspend");
					suspend.style.display = 'none';
					play.style.display = 'inline-block';
					wrap.style.display = 'none';
				})
			}
		}
	}

	function css(el,attr,val) {
		if(arguments.length < 3) {//当css传入的产生小于3时，及没有设置val,为获取元素属性值
			var val  = 0;
			if(el.currentStyle) {
				val = el.currentStyle[attr];//在标准浏览器下获取元素计算后样式
			} else {
				val = getComputedStyle(el)[attr];//在IE浏览器下获取元素计算后样式
			}
			if(attr == "opacity") {
				val*=100;//当获取的属性是透明度是将获取的值乘以100，
			}
			return parseFloat(val);//返回val
		}
		//当css传入的产生等于3时，及设置val,为修改元素属性值
		if(attr == "opacity") {//当需要修改的是元素的透明度时（val传入的需为0-100的整数）
			el.style.opacity = val/100;//在标准浏览器下修改透明度
			el.style.filter = "alpha(opacity = "+val+")";//在IE浏览器下修改透明度
		} else {//否则就修改元素对应的属性值。
			el.style[attr] = val + "px";
		}
	}

	var mTween = function (obj,attrs,times,type,fn){
		if(typeof times == 'undefined'){
			times = 400;
			type = 'linear';
		}
		if(typeof times == 'string'){
			type = times;
			times = 400;
		}
		if(typeof times == 'function'){
			fn = times;
			type = 'linear';
			times = 400;
		}
		if(typeof times == 'number'){
			if(typeof type == 'undefined'){
				type = 'linear';
			}
			if(typeof type == 'function'){
				fn = type;
				type = 'linear';
			}
		}
		var json = {};
		for(var attr in attrs){
			if(attr == 'opacity'){
				json[attr] = getComputedStyle(obj)[attr]*100;
			}else{
				json[attr] = parseInt(getComputedStyle(obj)[attr]);
			}
		}
		var start = new Date().getTime();
		var timer = setInterval(function(){
			var now = new Date().getTime();
			var t = Math.min(times,now - start);
			for(var attr in attrs){
				var value = Tween[type](t,json[attr],attrs[attr] - json[attr],times);
				if(attr == 'opacity'){
					obj.style.opacity = value/100;
				}else{
					obj.style[attr] = value + 'px';
				}
			}
			if(t == times){
				clearInterval(timer);
				if(typeof fn === 'function'){
					setTimeout(function(){
					    fn.call(obj);
					},16)
				}
			}
		},16);
	};




})()