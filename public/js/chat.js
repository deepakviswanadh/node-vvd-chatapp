
///////////client socket script/////////////////////////

let socket=io();


//Selectors///////////////////////////////////

let $msg=document.querySelector("#messages"),
$form=document.querySelector("#message-form"),
$txtbox=document.querySelector("input"),
$txtboxsend=document.querySelector("button"),
$locbutton=document.querySelector("#send-location"),
$sidebar=document.querySelector("#sidebar");

//temmplates/////////////////////////////////
let $msgTemp=document.querySelector("#message-template").innerHTML,
$locTemp=document.querySelector("#location-template").innerHTML,
$sideTemp=document.querySelector("#sidebar-template").innerHTML;

//Options

let {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});


//attach message to page
socket.on("message",x=>{
//console.log(x);
let y=Mustache.render($msgTemp,
{
	user:x.username,
	message:x.text,
	time:moment(x.createdAt).format("h:mm a")
});
$msg.insertAdjacentHTML("beforeend",y);

});


//text from input box and click submit in the form
$form.addEventListener("submit",e=>{
	e.preventDefault();
	$txtboxsend.setAttribute("disabled","disabled");
	// $txtboxsend.addEventListener("click",()=>{
		$txtboxsend.removeAttribute("disabled");
		socket.emit("input",$txtbox.value);
		$txtbox.value='';
		$txtbox.focus();
// });
});

//geo location  sharing
$locbutton.addEventListener("click",()=>{
	// if(!navigator.geolocation)
	// 	return alert("rip")
	navigator.geolocation.getCurrentPosition(position=>{
		socket.emit("location",[position.coords.latitude,position.coords.longitude]);
	});
});

// attach location to page
socket.on("locmessage",x=>{
	//console.log(x);
	let z=Mustache.render($locTemp,{
		user:x.username,
		location:x.url,
		time:moment(x.createdAt).format("h:mm a")
	});
	
	$msg.insertAdjacentHTML("beforeend",z);
});

//send username and room name from key value pairs

socket.emit("join",{username,room},error=>{
	if(error){
		alert(error);
		location.href="/";
	};
});


//render user list on left side bar

socket.on("roomData",({room,users})=>{
	let y=Mustache.render($sideTemp,{
     room,
     users
	});
	$sidebar.innerHTML=y;
});