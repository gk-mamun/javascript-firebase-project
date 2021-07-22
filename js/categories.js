const categoryList = document.querySelector('#category-list');
const categoyInForm = document.querySelector('#category-select-list');
const categoyInEditForm = document.querySelector('#edit-category-select-list');
const categoryInEditForm = document.querySelector('#edit-category-select-list')
const accountCategoryTable = document.querySelector('#account-category-list');
const categoryAlertBox = document.querySelector('#category-alert-box');
// Print categories
const printCategories = (data) => {
    let html = '';
    data.forEach(doc => {
        const category = doc.data();
        const li = `
            <li style="text-align: left;" class="list-group-item btn bg-dark" onclick="showCategoryApis('${doc.id}')">
                ${category.title}
            </li>
        `;
        html += li;
    });
    if(categoryList != null) {
        categoryList.innerHTML = html;
    }
    

    // print category in create api form
    selectOptions = '<option value="" disabled selected hidden>Select Category</option>';
    data.forEach(doc => {
        // const cat = doc.data();
        const option = `
            <option value="${doc.id}">${doc.data().title}</option>
        `;
        selectOptions += option;
    });
    categoyInForm.innerHTML = selectOptions;
    categoyInEditForm.innerHTML = selectOptions;

    // print category in account page
    let tbl = '';
    data.forEach(doc => {
        const tr = `
                <tr>
                    <td>${doc.data().title}</td>
                    <td style="text-align: center;">
                        <a class="secondary-btn bg-gray" onClick="showCategoryEditForm('${doc.id}' , '${doc.data().title}')">Edit</a>
                        <a href="#" class="btn btn-small btn-danger category-delete-btn" data-id="${doc.id}">Delete</a>
                    </td>
                </tr>
        `;
        tbl += tr;
    });
    accountCategoryTable.innerHTML = tbl;

    const categoryDeleteBtns = document.querySelectorAll(".category-delete-btn");
    deleteCategory(categoryDeleteBtns)

}

// Delete Category
const deleteCategory = (categoryDeleteBtns) => {
    categoryDeleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const catid = btn.getAttribute('data-id');

            let docRef = db.collection("categories").doc(catid)
            docRef.delete().then(() => {
                categoryAlertBox.innerHTML = '<div class="alert alert-success">Successfully Deleted</div>' ;
            }).catch(err => {
                categoryAlertBox.innerHTML = '<div class="alert alert-danger">' + err.message + '</div>' ;
            })

        })
    })
}

// Create new category
const createCategoryForm = document.querySelector("#create-category-form");
if (createCategoryForm != null) {
    createCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        db.collection('categories').add({
            title: createCategoryForm['category-title'].value,
        }).then(() => {
            categoryAlertBox.innerHTML = '<div class="alert alert-success">Successfully Created!</div>' ;
            createCategoryForm.reset();
        }).catch(err => {
            categoryAlertBox.innerHTML = '<div class="alert alert-danger">' + err.message + '</div>' ;
        })
    })
}


// Show edit form 
const catEditForm = document.querySelector("#edit-category-form");
const showCategoryEditForm = (catid, title) => {
    createCategoryForm.style.display = 'none';
    catEditForm.style.display = 'block';
    catEditForm["edit-category-id"].value = catid;
    catEditForm["new-category-title"].value = title;
}

// Edit category
if(catEditForm != null) {
    catEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const catid = catEditForm["edit-category-id"].value;
        const catname = catEditForm["new-category-title"].value;

        db.collection('categories').doc(catid).update({
            title: catname
        }).then(() => {
            categoryAlertBox.innerHTML = '<div class="alert alert-success">Successfully Updated.</div>' ;
            createCategoryForm.style.display = 'block';
            catEditForm.style.display = 'none';
        }).catch(err => {
            categoryAlertBox.innerHTML = '<div class="alert alert-danger">' + err.message + '</div>' ;
        })

    })
}

// Hide category edit form
const catEditCloseBtn = document.querySelector('#close-edit-category-form-btn');
if(catEditCloseBtn != null) {
    catEditCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createCategoryForm.style.display = 'block';
        catEditForm.style.display = 'none';
    });
}

// show - hide menu for users
const loggedInMenus = document.querySelectorAll(".logged-in");
const loggedOutMenus = document.querySelectorAll(".logged-out");
const userData = document.querySelector('#user-data');
const loggedInContent = document.querySelector('#logged-in-account-content');
const loggedOutContent = document.querySelector('#logged-out-account-content');

const manageUserUI = (user) => {
    if(user) {
        loggedInMenus.forEach(menu => menu.style.display = "block");
        loggedOutMenus.forEach(menu => menu.style.display = "none");
        loggedInContent.style.display = "block";
        loggedOutContent.style.display = "none";

        html = `
            <p>${user.email}</p>
        `;

        userData.innerHTML = html;


    }
    else {
        loggedInMenus.forEach(menu => menu.style.display = "none");
        loggedOutMenus.forEach(menu => menu.style.display = "block");
        loggedInContent.style.display = "none";
        loggedOutContent.style.display = "block";
    }
}

