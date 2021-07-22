const apiList = document.querySelector('#apis-container');
const userApiList = document.querySelector("#user-api-list");

// Print user api list in account page
const printUserApis = (data) => {
    let html = '';
    let count = 1;
    data.forEach(doc => {
        const api = doc.data();
        const tr = `
            <tr>
                <th scope="row">${count}</th>
                <td>${api.title}</td>
                <td style="text-align: center">
                    <a class="secondary-btn bg-gray me-3" onClick="showApiEditForm('${doc.id}')">Edit</a>
                    <a href="#" class="btn-danger secondary-btn api-delete-btn" data-id="${doc.id}">Delete</a>
                </td>
            </tr>
        `;
        count += 1;

        html += tr;
    });

    userApiList.innerHTML = html;

    const apiDeleteBtns = document.querySelectorAll(".api-delete-btn");
    deleteApiDetail(apiDeleteBtns)

}

// Delete Api detail
const deleteApiDetail = (apiDeleteBtns) => {
    apiDeleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const apiId = btn.getAttribute('data-id');
            const alertBox = document.querySelector('#api-change-alert');

            let docRef = db.collection("apis").doc(apiId)
            docRef.delete().then(() => {
                alertBox.innerHTML = '<div class="alert alert-success">Successfully Deleted</div>' ;
            }).catch(err => {
                alertBox.innerHTML = '<div class="alert alert-success">' + err.message + '</div>' ;
            })

        })
    })
}

// Print api list
const printApis = (data) => {
    let html = '';
    data.forEach(doc => {
        const api = doc.data();
        const div = `
        <div class="card pt-4 pb-4 b-r-5 box-shadow mb-5">
            <div class="card-body">
                <h5 class="card-title">${api.title}</h5>
                <p class="card-text mb-4">${api.description.substring(0,200) + '...'}</p>
                <a href="#" class="bg-primary secondary-btn api-detail-btn" data-bs-toggle="modal" data-bs-target="#apiDetailModal" data-id="${doc.id}">View Detail</a>
            </div>
        </div>
        `;
        html += div;
    });

    apiList.innerHTML = html;

    const apiDetailBtns = document.querySelectorAll(".api-detail-btn");
    // console.log(apiDetailBtns)
    getSingleApiDetail(apiDetailBtns)
}

// Print api list of particular category
const showCategoryApis = (catid) => {
    console.log(catid);
    db.collection('apis').where("catid", "==", catid).get()
    .then(snapshot => {
        printApis(snapshot.docs);
        // window.location.href = "http://127.0.0.1:5500/index.html";
    }).catch((error) => {
        console.log("Error: ", error );
    })
}

// Print api detail in modal
const getSingleApiDetail = (apiDetailBtns) => {
    
    apiDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

           const apiId = btn.getAttribute('data-id');

           let docRef = db.collection("apis").doc(apiId);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    const api_thumbnail = document.querySelector('#api-thumbnail');
                    const api_title = document.querySelector('#api-title');
                    const api_detail = document.querySelector('#api-detail');
                    const website = document.querySelector('#api-website');
                    const tutorial = document.querySelector('#api-tutorial');
                    const github = document.querySelector('#api-github');

                    api_thumbnail.setAttribute('src', doc.data().thumbnailurl);
                    api_title.innerHTML = doc.data().title;
                    api_detail.innerHTML = doc.data().description;

                    if(doc.data().website != '') {
                        website.style.display = "inline-block";
                        website.setAttribute('href', doc.data().website);
                    } else {
                        website.style.display = "none";
                    }

                    if(doc.data().tutorial != '') {
                        tutorial.style.display = "inline-block";
                        tutorial.setAttribute('href', doc.data().tutorial);
                    } else {
                        tutorial.style.display = "none";
                    }

                    if(doc.data().github != '') {
                        github.style.display = "inline-block";
                        github.setAttribute('href', doc.data().github);
                    } else {
                        github.style.display = "none";
                    }

                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        })
    })
}


// create new api detail
const createApiForm = document.querySelector("#create-api-form");
if (createApiForm != null) {
    createApiForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        db.collection('apis').add({
            catid: createApiForm['category-select-list'].value,
            description: createApiForm['description'].value,
            github: createApiForm['github-link'].value,
            thumbnailurl: createApiForm['thumbnail-url'].value,
            title: createApiForm['title'].value,
            tutorial: createApiForm['tutorial-link'].value,
            userid: auth.currentUser.uid,
            website: createApiForm['website-url'].value
        }).then(() => {
            const RegisterBackDrop = document.querySelector('.modal-backdrop');
            const registerModal = document.querySelector("#createModal");
            registerModal.classList.remove("show");
            registerModal.setAttribute('aria-hidden', 'true');
            registerModal.setAttribute('style', 'display:none')
            document.body.removeChild(RegisterBackDrop);
            window.location.href = "http://127.0.0.1:5500/index.html";
        })
    })
}


// show api detail in edit form
const editApiFormDiv = document.querySelector('#edit-api-form-div');
const editApiForm = document.querySelector('#edit-api-form');
const showApiEditForm = (editApiId) => {
    editApiFormDiv.style.display = 'block';

    let docRef = db.collection("apis").doc(editApiId);
    docRef.get().then((doc) => {
        if (doc.exists) {
            editApiForm['edit-api-id'].value = editApiId;
            editApiForm['edit-title'].value = doc.data().title;
            editApiForm['edit-thumbnail-url'].value = doc.data().thumbnailurl;
            editApiForm['edit-description'].innerHTML = doc.data().description;

            if(doc.data().website != '') {
                editApiForm['edit-website-url'].value = doc.data().website;
            } else {
                editApiForm['edit-website-url'].value = '';
            }

            if(doc.data().github != '') {
                editApiForm['edit-github-link'].value = doc.data().github;
            } else {
                editApiForm['edit-github-link'].value = "";
            }

            if(doc.data().tutorial != '') {
                editApiForm['edit-tutorial-link'].value = doc.data().tutorial;
            } else {
                editApiForm['edit-tutorial-link'].value = "";
            }

        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// Edit api detail
const editApiAlertBox = document.querySelector('#edit-api-alert-div');
if(editApiForm != null) {
    editApiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = editApiForm["edit-api-id"].value;
        const newTitle = editApiForm["edit-title"].value;
        const newThumbnailUrl = editApiForm["edit-thumbnail-url"].value;
        const newCatId = editApiForm["edit-category-select-list"].value;
        const newWebsite = editApiForm["edit-website-url"].value;
        const newGithub = editApiForm["edit-github-link"].value;
        const newTutorial = editApiForm["edit-tutorial-link"].value;
        const newDescription = editApiForm["edit-description"].value;

        db.collection('apis').doc(editId).update({
            catid: newCatId,
            description: newDescription,
            github: newGithub,
            thumbnailurl: newThumbnailUrl,
            title: newTitle,
            tutorial: newTutorial,
            userid: auth.currentUser.uid,
            website: newWebsite
        }).then(() => {
            editApiAlertBox.innerHTML = '<div class="alert alert-success">Successfully Updated.</div>' ;
            editApiFormDiv.style.display = 'none';
        }).catch(err => {
            editApiAlertBox.innerHTML = '<div class="alert alert-danger">' + err.message + '</div>' ;
        })

    })
}

// Hide edit api detail form
const apiEditCloseBtn = document.querySelector('#close-edit-api-form-btn');
if(apiEditCloseBtn != null) {
    apiEditCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        editApiFormDiv.style.display = 'none';
    });
}
