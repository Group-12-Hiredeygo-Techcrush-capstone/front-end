document.addEventListener("DOMContentLoaded", function(){

// PLAN SELECT
window.selectPlan = function(el){
document.querySelectorAll(".plan").forEach(p=>{
p.classList.remove("active");

let circle = p.querySelector("div");
if(circle) circle.className = "select-light";
});

el.classList.add("active");

let selected = el.querySelector("div");
if(selected) selected.className = "select-bold";
}

// CARD SELECT
window.selectCard = function(el){
document.querySelectorAll(".card").forEach(c=>{
c.classList.remove("active");
});
el.classList.add("active");
}

// DROPDOWN
window.toggleDropdown = function(){
const menu = document.getElementById("dropdownMenu");
menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// CLOSE DROPDOWN
window.addEventListener("click", function(e){
const user = document.querySelector(".user");
const menu = document.getElementById("dropdownMenu");

if(!user.contains(e.target)){
menu.style.display = "none";
}
});

// NOTIFICATION
window.toggleNotification = function(){
alert("You have new notifications!");
}

// LOGOUT
window.logout = function(){
alert("Logging out...");
}

// FORMAT CARD
document.getElementById("cardNumber").addEventListener("input", function(e){
let value = e.target.value.replace(/\D/g, "").substring(0,16);
let formatted = value.match(/.{1,4}/g);
e.target.value = formatted ? formatted.join(" ") : value;
});

// EXPIRY
document.getElementById("expiry").addEventListener("input", function(e){
let value = e.target.value.replace(/\D/g, "").substring(0,4);

if(value.length >= 3){
value = value.substring(0,2) + " / " + value.substring(2);
}

e.target.value = value;
});

// CVC
document.getElementById("cvc").addEventListener("input", function(e){
e.target.value = e.target.value.replace(/\D/g, "").substring(0,3);
});

// VALIDATION
document.getElementById("paymentForm").addEventListener("submit", function(e){

let card = document.getElementById("cardNumber").value;
let expiry = document.getElementById("expiry").value;
let cvc = document.getElementById("cvc").value;

if(card.length < 19 || expiry.length < 5 || cvc.length < 3){
e.preventDefault();
alert("Please fill all required fields correctly");
}

});

});