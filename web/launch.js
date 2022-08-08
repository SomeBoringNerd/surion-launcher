const button = document.getElementById('btn');
const label = document.getElementById('name');
const erro = document.getElementById('error');

let launched = false;

button.addEventListener('click', () => {
    launch(label.value)
});


function launch(username)
{
    if(launched) return alert("le jeu est déjà lancé !");

    if(username.length <= 2 || username.length >= 17) return alert("Username invalide : merci de mettre un nom d'utilisateur entre 3 et 16 caractères");

    let patern = /^[a-zA-Z0-9_]{2,16}$/;

    if(!patern.test(username)) return alert("Username invalide : merci de ne mettre que des lettres, des chiffres et des _");

    console.log("launching the game with username : " + username)

    let url = "http://localhost:55555/launch?player=" + username;
    window.location.href = url;
    launched = true;
}