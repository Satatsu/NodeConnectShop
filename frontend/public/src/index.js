const logout = document.querySelector('.logout');
const msg = document.querySelector('.msg-Log');
const loader = document.querySelector('.loader');
const hide1 = document.querySelector('.hide1');
const hide2 = document.querySelector('.hide2');
const editAvatar = document.querySelector('.editAvatar');
const avatared = document.querySelector('.avatared');
window.addEventListener('load', () => {
  loader.classList.add('fondu-out');
  document.body.style.overflow = 'auto';
});

document.addEventListener("DOMContentLoaded", function () {
  const cursor = document.querySelector(".cursor");

  function updateCursor(e) {
    const x = e.pageX - window.scrollX;
    const y = e.pageY - window.scrollY;

    cursor.style.transition = "transform 0.1s ease";
    cursor.style.transform = `translate(${x - cursor.offsetWidth / 2}px, ${y - cursor.offsetHeight / 2}px)`;
  }

  document.addEventListener("mousemove", updateCursor);

  window.addEventListener("scroll", function () {
    cursor.style.transition = "none"; 
  });

  window.addEventListener("blur", function () {
    cursor.style.transition = "none"; 
  });

  window.addEventListener("focus", function () {
    cursor.style.transition = "transform 0.1s ease"; 
  });
});

const verifyJWT = () => {
  const cookie = document.cookie
  const modifiedcookie = cookie.slice(4);
  const token = modifiedcookie
  console.log(modifiedcookie);
  const currentUser = document.querySelector('.currentUser');
  const userAvatar = document.getElementById('userAvatar');
  fetch('http://localhost:3000/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Réponse de l\'API :', data);
      const userEmail = data.user.user.email;
      console.log(data.user.avatar);
      console.log(userEmail);
      currentUser.textContent = `${userEmail}`;
      userAvatar.src = data.user.avatar ? `data:image/jpg;base64,${data.user.avatar}` : 'https://media.istockphoto.com/id/1130884625/fr/vectoriel/ic%C3%B4ne-de-vecteur-de-membre-dutilisateur-pour-linterface-utilisateur-dui-ou-lapplication.jpg?s=612x612&w=0&k=20&c=CkeMorHWI4UwOmQ0zSpvJ-F8Lj_SAMjPJxcXwHS1po4=';
      avatared.src = data.user.avatar ? `data:image/jpg;base64,${data.user.avatar}` : 'https://media.istockphoto.com/id/1130884625/fr/vectoriel/ic%C3%B4ne-de-vecteur-de-membre-dutilisateur-pour-linterface-utilisateur-dui-ou-lapplication.jpg?s=612x612&w=0&k=20&c=CkeMorHWI4UwOmQ0zSpvJ-F8Lj_SAMjPJxcXwHS1po4=';
      hide1.style.display = 'flex';
      hide2.style.display = 'flex';
      editAvatar.style.display = 'flex';
      logout.style.display = 'flex';
    })
    .catch(error => {
      console.error('Erreur lors de la requête API :', error);
    });

};

window.addEventListener('load', verifyJWT);
logout.addEventListener('click', async (e) => {

  e.preventDefault();
  if (document.cookie.includes('jwt')) {
    function hideMsg() {
      msg.style.cssText = 'display: none';
    }

   
    msg.style.cssText = 'display: flex';

   
    setTimeout(hideMsg, 2000);
    setTimeout(function () {
      location.reload();
    }, 2000)

  } else {
    alert('you are already deconnected');
  }
  function supprimerTousLesCookies() {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const nomDuCookie = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = nomDuCookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }
  supprimerTousLesCookies();
});

const closeEdit = document.querySelector('.closeEdit');
const openEdit = document.querySelector('.editAvatar');
const userImg = document.querySelector('.userImg');


openEdit.addEventListener('click', () => {
  userImg.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});
closeEdit.addEventListener('click', () => {
  userImg.style.display = 'none';
  document.body.style.overflow = '';
});


document.addEventListener('DOMContentLoaded', function () {
  const uploadButton = document.getElementById('uploadButton');
  const imageInput = document.getElementById('imageInput');
  const avatarPreview = document.getElementById('avatarPreview');

  imageInput.addEventListener('change', handleImageUpload);
  uploadButton.addEventListener('click', uploadImage);
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Afficher la prévisualisation de l'image sélectionnée
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('avatarPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function uploadImage() {
  const file = document.getElementById('imageInput').files[0];
  if (file) {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('http://localhost:3000/uploads', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);

        // Mettre à jour l'avatar avec l'image uploadée
        document.getElementById('avatarPreview').src = responseData.imageUrl;
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert('Error uploading image');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    }
  } else {
    alert('Please select an image to upload.');
  }
}
const revealProfil = document.querySelector('.revealProfil');
const settingUser = document.querySelector('.settingUser');
const imgRevealProfil = document.querySelector('.imgRevealProfil');

revealProfil.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(settingUser).display;
  settingUser.style.display = currentDisplay === 'none' ? 'flex' : 'none';
  if (currentDisplay === 'none') {
    imgRevealProfil.src = '../img/angle-de-la-fleche-vers-le-haut.png';
  } else {
    imgRevealProfil.src = '../img/fleche-vers-le-bas.png';
  }
});

const passwordEditBtn = document.querySelector('.passwordEditBtn');
const profilEditBtn = document.querySelector('.profilEditBtn');
const slide1Elements = document.querySelectorAll('.userImg .slide1');
const slide2Elements = document.querySelectorAll('.slide2');

passwordEditBtn.addEventListener('click', () => {
  slide1Elements.forEach(element => {
    element.style.display = 'none'; 
  });

  slide2Elements.forEach(element => {
    element.style.display = 'flex';
  });
  passwordEditBtn.classList.add('underline');
  profilEditBtn.classList.remove('underline');
});
profilEditBtn.addEventListener('click', () => {
  slide1Elements.forEach(element => {
    element.style.display = 'flex'; 
  });

  slide2Elements.forEach(element => {
    element.style.display = 'none';
  });
  profilEditBtn.classList.add('underline');
  passwordEditBtn.classList.remove('underline');
});


document.getElementById('passwordForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  try {
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }
    const cookie = document.cookie;
    const modifiedcookie = cookie.slice(4);
    const token = modifiedcookie;
    const response = await fetch('http://localhost:3000/editPasswordConnect', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword, token }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Password updated successfully !');
      window.location.reload();
    } else if (response.status === 401) {
      console.error('Invalid token:', data.error);
    } else {
      console.error('Internal Server Error:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
