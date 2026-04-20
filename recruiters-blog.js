const btn = document.querySelector(".explore-btn");
btn.addEventListener("click", () =>{
    window.location.href = "about.html"
});

console.log("hello world")

const explore = document.querySelector(".read-articles-btn");
explore.addEventListener("click",() =>{
     window.location.href ="home.html"
    
});
 if("explore===active"){
        console.log("active")
     }else{
        console.log("not active")
     }
console.log("it has been clicked")



const subscribe = document.querySelector(".subscribe-btn");
subscribe.addEventListener("click", () =>{
    window.location.href = "subscribe.html"
})

if("subscribe ===true"){
    console.log("logged in")
}else{
    console.log("not logged in")
}