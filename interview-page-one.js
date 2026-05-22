// const filterToggle = document.getElementById("filterToggle");
// const filterPanel = document.getElementById("filterPanel");

// filterToggle.addEventListener("click", () => {
//   filterPanel.classList.toggle("hidden");
// });




// const statusFilter = document.getElementById("statusFilter");
// const filterP = document.getElementById("filterP");

// statusFilter.addEventListener("change", () => {
//   const selectedText = statusFilter.options[statusFilter.selectedIndex].text;
//   filterP.textContent = selectedText;
// });


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


// Add interactivity for Reschedule buttons
document.querySelectorAll('.third-div-second-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    // You can customize the candidate name extraction if needed
    let candidateBox = btn.closest('.main-div-first-box');
    let candidateName = candidateBox ? candidateBox.querySelector('.name-tag-title')?.textContent?.trim() : 'Candidate';
    alert(`A rescheduling message has been sent to ${candidateName}.`);
    // Optionally, update button text or state here
    // btn.textContent = 'Reschedule Sent';
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


