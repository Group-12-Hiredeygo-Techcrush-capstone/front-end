const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");

filterToggle.addEventListener("click", () => {
  filterPanel.classList.toggle("hidden");
});




const statusFilter = document.getElementById("statusFilter");
const filterP = document.getElementById("filterP");

statusFilter.addEventListener("change", () => {
  const selectedText = statusFilter.options[statusFilter.selectedIndex].text;
  filterP.textContent = selectedText;
});


const buttons =document.querySelectorAll(".third-div-btn");
buttons.forEach((button)=>{
  button.addEventListener("click", ()=>{
button.classList.toggle("marked");
if(button.classList.contains("marked")){
  button.textContent = "Marked";

}else{
  button.textContent= "Mark As Read"
}
  })

})

const reminderButtons = document.querySelectorAll(".Send-reminder-btn");
reminderButtons.forEach((button)=>{
  button.addEventListener("click", ()=>{
   const candidateName = button.dataset.name;
   console.log(`Reminder sent to $ {Fatimo Bello}`);
   button.dataset.status = "Unmarked"

   const isMarked = button.dataset.status=== "Marked"

  //  button.textContent = "Reminder sent";
  //  button.ariaDisabled = false;

  if (isMarked){
    button.dataset.status = "Unmarked"
      button.textContent = "Reminder sent";
   button.classList.remove("Marked")
  }else{
    button.dataset.status = "Marked"
      button.textContent = "Reminder sent";
   button.classList.add("Marked");
  }
  });
});


const leftBtn = document.querySelector(".first-left-icon");
const rightBtn = document.querySelector(".second-right-icon");
const valueBtn = document.querySelector(".middle-btn");

let value = 1;
rightBtn.addEventListener("click", ()=>{
  value++;
  valueBtn.textContent= value;
});

leftBtn.addEventListener("click", ()=>{
  if(value > 0){
    value--;
    valueBtn.textContent = value;
  }
})


