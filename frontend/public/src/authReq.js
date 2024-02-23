const logout = document.querySelector('.logout');
const msg = document.querySelector('.msg-Log');
const loader = document.querySelector('.loader');
const hide1 = document.querySelector('.hide1');
const hide2 = document.querySelector('.hide2');

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
    cursor.style.transition = "none"; // Supprimer la transition pendant le défilement
  });

  window.addEventListener("blur", function () {
    cursor.style.transition = "none"; // Supprimer la transition lorsque la fenêtre perd le focus
  });

  window.addEventListener("focus", function () {
    cursor.style.transition = "transform 0.1s ease"; // Rétablir la transition lorsqu'on revient sur la fenêtre
  });
});
const verifyJWT = async () => {
  try {
    // Ajoutez le style pour masquer le contenu
    document.body.style.display = 'none';

    const cookie = document.cookie;
    const modifiedCookie = cookie.slice(4);
    const token = modifiedCookie;
    console.log(modifiedCookie);

    const currentUser = document.querySelector('.currentUser');
    const response = await fetch('http://localhost:3000/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    console.log('Réponse de l\'API :', data);

    if (response.ok) {
      console.log(data.message);
      if (data.message == 'Token valide') {
        console.log('Réponse de l\'API :', data);
      const userEmail = data.user.user.email;
      console.log(data.user.avatar);
      console.log(userEmail);
      currentUser.textContent = `${userEmail}`;
      userAvatar.src = data.user.avatar ? `data:image/jpg;base64,${data.user.avatar}` : 'https://media.istockphoto.com/id/1130884625/fr/vectoriel/ic%C3%B4ne-de-vecteur-de-membre-dutilisateur-pour-linterface-utilisateur-dui-ou-lapplication.jpg?s=612x612&w=0&k=20&c=CkeMorHWI4UwOmQ0zSpvJ-F8Lj_SAMjPJxcXwHS1po4=';
      hide1.style.display = 'flex';
      hide2.style.display = 'flex';
      } else if (data.message == 'Token manquant') {
        console.log('error');
        await hideBodyAndRedirect();
      }
    } else {
      console.error('Erreur lors de la requête API :', data.message);
      await hideBodyAndRedirect();
    }

    // Supprimez le style pour afficher le contenu après les vérifications du token
    document.body.style.display = '';
  } catch (error) {
    console.error('Erreur lors de la requête API :', error.message);
  }
};

const hideBodyAndRedirect = async () => {
  // Ajoutez le style pour masquer le contenu
  document.body.style.display = 'none';
  window.location.href = "/frontend/public/src/index.html";
};

window.addEventListener('load', verifyJWT);




  
  logout.addEventListener('click', async(e) => {
  console.log('checkout');
    e.preventDefault();
    if (document.cookie.includes('jwt')) {
        function hideMsg() {
      msg.style.cssText = 'display: none';
  }
  
  // Afficher msg pendant trois secondes
  msg.style.cssText = 'display: flex';
  
  // Masquer msg après trois secondes
   setTimeout(hideMsg, 2000);
   setTimeout(function() {
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
  const revealProfil = document.querySelector('.revealProfil');
const settingUser = document.querySelector('.settingUser');
const imgRevealProfil = document.querySelector('.imgRevealProfil');

revealProfil.addEventListener('click', () => {
  const currentDisplay = getComputedStyle(settingUser).display;

  // Toggle the display property
  settingUser.style.display = currentDisplay === 'none' ? 'flex' : 'none';

  if (currentDisplay === 'none') {
    // Change the image of imgRevealProfil when settingUser is revealed
    imgRevealProfil.src = '../img/angle-de-la-fleche-vers-le-haut.png';
  }else{
    imgRevealProfil.src = '../img/fleche-vers-le-bas.png';
  }
});