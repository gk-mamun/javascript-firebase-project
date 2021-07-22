// user registration
const registerForm = document.querySelector('#registration-form');
if (registerForm != null) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = registerForm["user-email"].value;
        const password = registerForm["user-password"].value;
        const confirmPassword = registerForm["user-confirm-password"].value;
        // const profilePic = registerForm['profile-picture'];

        // let file = {};

        const passwordMatchAlert = document.querySelector('#password-match-alert');
        const registerAlert = document.querySelector('#register-alert');

        // function chooseFile(e) {
        //     file = e.target.files[0]
        // }

        if(password != confirmPassword) {
            console.log('password does not match');
            passwordMatchAlert.innerHTML= '<div class="alert alert-danger">Passwords do not match</div>';

            setTimeout(function() {
                passwordMatchAlert.innerHTML= '';
            }, 2500);
        }
        else {

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredentials => {
                    // fiebase.storage().ref('users/' + userCredentials.user.uid + '/profile.jpg').put(file).then(() => {
                    //     console.log('Successfully created')
                    // }).catch(error => {
                    //     console.log(error.message);
                    // })
                    window.location.href = "http://127.0.0.1:5500/index.html";
                }).catch(error => {
                    console.log(error.message);
                    registerAlert.innerHTML = '<div class="alert alert-danger">' + error.message +'</div>';
                });
        } 
    })
}


// Logout user
const logout = document.querySelector("#logout-btn");
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    window.location.href = "http://127.0.0.1:5500/index.html";
})


// login
const loginForm = document.querySelector("#login-form");
if(loginForm != null) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = loginForm["login-email"].value;
        const password = loginForm["login-password"].value;
        
        const loginAlert = document.querySelector('#login-alert');

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                // console.log(userCredentials.user);
                const loginModal = document.querySelector("#loginModal");
                const loginBackDrop = document.querySelector('.modal-backdrop');
                loginModal.classList.remove("show");
                loginModal.setAttribute('aria-hidden', 'true');
                loginModal.setAttribute('style', 'display:none')
                document.body.removeChild(loginBackDrop);
                loginForm.reset();
            }).catch(error => {
                loginAlert.innerHTML = '<div class="alert alert-danger">' + error.message + '</div>';
            })
    })
}


// Manage auth user
auth.onAuthStateChanged(user => {
    if( user ) {
        manageUserUI(user);
        db.collection('apis').where("userid", "==", user.uid).onSnapshot(snapshot =>   {
                printUserApis(snapshot.docs);
            })

    } else {
        manageUserUI();
    }
})


// fetch category data
db.collection('categories').onSnapshot(snapshot => {
        printCategories(snapshot.docs);
    });


// fetch api data
db.collection('apis').get()
    .then(snapshot => {
        printApis(snapshot.docs);
    }).catch((error) => {
        console.log("Error: ", error );
    })

