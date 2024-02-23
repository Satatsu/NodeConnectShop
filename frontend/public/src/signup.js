const form = document.querySelector("form");
const passwordError = document.querySelector(".password.error");
const emailError = document.querySelector(".email.error");
const confirmEd = document.querySelector(".confirmEd");
const trueEd = document.querySelector(".trueEd");

form.addEventListener('input', (e) => {
  const password = form.password.value;
  const confirmPassword = form.confirmPass.value;
  if (password === confirmPassword && confirmPassword.length >= 8) {
    confirmEd.style.display = 'flex';
  }else {
    confirmEd.style.display = 'none';
  }
 
  if (password.length >= 8) {
    trueEd.style.display = 'flex';
  } else {
    trueEd.style.display = 'none';
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  passwordError.textContent = "";
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPass.value;
  const confirmed = true ? password == confirmPassword : false;
  console.log(email, password, confirmPassword);
  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password, confirmed: confirmed }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Activer les l'identification (cookies)
    });
    const data = await res.json();
    console.log(data);
    if (confirmPassword !== password || data.error) {
      passwordError.textContent = 'password or email is incorrect';
      passwordError.style.color = 'red';
      passwordError.style.textAlign = 'center';
    } else {
      window.location.href = "/frontend/public/src/index.html";
    }

  } catch (err) {
    console.error("Error during fetch or JSON parsing:", err);
    if (err instanceof SyntaxError && err.message === "Unexpected end of JSON input") {
      console.log("Empty or non-JSON response from the server");
    } else {
      console.log(err);
    }
  }
});
