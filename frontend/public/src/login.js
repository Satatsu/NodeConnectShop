const form = document.querySelector('form');
const emailError = document.querySelector(".email.error");
const passwordError = document.querySelector(".password.error");
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  const rememberMe = form.rememberMe.checked;
  console.log(email, password, rememberMe);

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Activer les informations d'identification (cookies)
    });
    const data = await res.json();
    console.log(data.user);
    if (data.user) { 
      window.location.href = "/frontend/public/src/index.html";
    } else {
      passwordError.textContent = 'something wrong ';
      passwordError.style.color = 'red';
      passwordError.style.textAlign = 'center';
    }
  } catch (err) {
    console.log(err);
  }
});
