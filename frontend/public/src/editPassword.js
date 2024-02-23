const form = document.querySelector('form');
const passwordError = document.querySelector(".password.error");
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  console.log(email, password);

  try {
    const res = await fetch(`http://localhost:3000/editPassword/${email}`, {
      method: 'PUT',
      body: JSON.stringify({email: email,password: password}),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Activer les informations d'identification (cookies)
    });
    const data = await res.json();
    console.log(data);
    if (data && password.length >= 8) { 
      window.location.href = "/frontend/public/src/login.html";
      alert('The password is changed!')
    }
    else {
      passwordError.textContent = 'something wrong, please try again';
      
    }
  } catch (err) {
    console.log(err);
  }
});
