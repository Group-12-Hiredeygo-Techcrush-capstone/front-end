   document.getElementById("my-form").addEventListener("submit", function(e){
    let Username = document.getElementById("Username").value;
    let password = document.getElementById("password").value;
    
   if(Username ==="" ){
    e.preventDefault();
    document.getElementById("message").textContent = "Email address is required!";
   }else if (password ===""){
    e.preventDefault();
    document.getElementById("message").textContent = "password is required";
   }
});

Username.addEventListener("input", function(){
if (Username.value !==""){
   Message.textContent = "";
}
})

password.addEventListener("input", function(){
if (password.value !== ""){
   Message.textContent = "";
}else{
   console.log("Your code is not vallied")
}
})


