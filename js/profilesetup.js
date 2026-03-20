
// <button onclick="uploadLogo()">Upload Logo</button>

// const baseUrl = "https://your-api-base-url.com";
// const companyId = "123";

// async function uploadLogo() {
//   const fileInput = document.getElementById("logoInput");
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Please select a file");
//     return;
//   }

//   // ✅ 2MB = 2 * 1024 * 1024 bytes
//   const maxSize = 2 * 1024 * 1024;

//   if (file.size > maxSize) {
//     alert("Logo must not be more than 2MB");
//     return;
//   }

//   // (Optional) Validate file type
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//   if (!allowedTypes.includes(file.type)) {
//     alert("Only JPG and PNG images are allowed");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("logo", file);

//   try {
//     const response = await fetch(`${baseUrl}/companies/${companyId}/logo`, {
//       method: "POST",
//       body: formData,
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     });

//     if (!response.ok) {
//       throw new Error("Upload failed");
//     }

//     alert("Logo uploaded successfully!");

//   } catch (error) {
//     console.error(error);
//     alert("Upload failed");
//   }
// }




// // const button = document.getElementById("saveBtn");

// // // get email from URL (from OTP page)
// // const params = new URLSearchParams(window.location.search);
// // const email = params.get("email");

// // button.addEventListener("click", async () => {
// //     button.textContent = "Saving...";
// //     button.disabled = true;

// //     const data = {
// //         email: email,
// //         companyName: document.getElementById("companyName").value,
// //         industry: document.getElementById("industry").value,
// //         website: document.getElementById("website").value,
// //         headquarters: document.getElementById("headquarters").value,
// //         companySize: document.getElementById("companySize").value,
// //         aboutCompany: document.getElementById("aboutCompany").value
// //     };

// //     try {
// //         const response = await fetch("https://hire-dey-go-be.onrender.com/api/v1/profile/setup", {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json"
// //             },
// //             body: JSON.stringify(data)
// //         });

// //         const result = await response.json();

// //         if (response.ok) {
// //             alert("Profile saved successfully!");

// //             // move to next step
// //             window.location.href = "foundinginfo.html";

// //         } else {
// //             alert(result.message || "Failed to save profile");
// //         }

// //     } catch (error) {
// //         alert("Network error. Try again.");
// //     }

// //     button.textContent = "Save & Continue →";
// //     button.disabled = false;
// // });
const fileInput = document.getElementById("logoInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileName = document.getElementById("fileName");
const errorMsg = document.getElementById("errorMsg");

// ✅ Open local drive when button is clicked
chooseBtn.addEventListener("click", () => {
  fileInput.click();
});

// ✅ Show selected file name
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    fileName.textContent = file.name;
  }
});