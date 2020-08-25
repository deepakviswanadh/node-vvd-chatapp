let users=[];


////////////////add user///////////////////////////////
let addUser=({id,username,room})=>{

//if empty data is given return error
if(!username||!room){
	return{
		error:"username and room are required!"
	};
};

//generalize data to avoid duplicates like shay and Shay
username=username.trim().toLowerCase();
room=room.trim().toLowerCase();

 //check if any user has the same name as the new 1 in that particular room(no 2 shays are allowed)
 let existUser=users.find(user=>{
	return user.username===username && user.room===room;//returns true or false
});

//if they do exist, return error 
if(existUser){
	return {
		error:"username already in use"
	};
};

//store user
let user={id,username,room};
users.push(user);
return {user};
};

//////////////remove user/////////////////////////

let removeUser=id=>{
	let index=users.findIndex(user=>user.id===id);

	if(index!==-1)
		return users.splice(index,1)[0];
};

/////////////get user/////////////////////////////

let getUser=id=>{
	return users.find(user=>user.id===id);
};

////////////get users list/////////////////////////////

let getAllUsers=room=>{
	room=room.trim().toLowerCase();
	return users.filter(user=>user.room===room);
};

module.exports={
	addUser,
	removeUser,
	getUser,
	getAllUsers
};


