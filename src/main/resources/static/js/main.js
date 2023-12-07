


$('document').ready(function(){
    Header();
    GetUsers();

    const formNewUser = document.forms["new_user_form"];
    formNewUser.addEventListener("submit", event => {
        event.preventDefault();
        const idUser = parseInt(formNewUser.elements["id-new"].value);
        CreateData(idUser, formNewUser);
    })

    const formDelete = document.forms["deleteForm"];
    formDelete.addEventListener("submit", event => {
        event.preventDefault();
        const idUser = parseInt(formDelete.elements["idHiddenDel"].value);
        DeleteUser(idUser);
    })

    const formEdit = document.forms["editForm"];
    formEdit.addEventListener("submit", event => {
        event.preventDefault();
        const idUser = parseInt(formEdit.elements["idHidden"].value);
        CreateData(idUser, formEdit);
    })

    function CreateData(id, form) {
        let dataObj = {};
        if (id != 0) {
            dataObj["id"] = id;
        }
        dataObj["firstName"] = form.elements["firstName"].value;
        dataObj["lastName"] = form.elements["lastName"].value;
        dataObj["age"] = parseInt(form.elements["age"].value);
        dataObj["email"] = form.elements["email"].value;
        dataObj["password"] = form.elements["password"].value;
        let yearSelect = new Array();
        let i = 0;
        if (id == 0) {
            $("#role_new option:selected").each(function(){
                if ($(this).val() === "1") {
                    yearSelect[i] = {"id": 1, "name": "ADMIN"};
                } else {
                    yearSelect[i] = {"id": 2, "name": "USER"};
                };
                i++;
            });
        } else {
            $("#role option:selected").each(function(){
                if ($(this).val() === "1") {
                    yearSelect[i] = {"id": 1, "name": "ADMIN"};
                } else {
                    yearSelect[i] = {"id": 2, "name": "USER"};
                };
                i++;
            });
        }
        dataObj["roles"] = yearSelect;
        if (id == 0) {
            CreateUser(dataObj);
        } else {
            EditUser(dataObj, id)
        }
    }
});

async function CreateUser(data) {
    const response = await fetch("api/users", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    if (response.ok === true) {
        const elements = document.querySelectorAll(".user");
        elements.forEach(el => el.remove());
        GetUsers();
        document.getElementById("newUser").setAttribute("class", "tab-pane");
        document.getElementById("nav-link-new-user").setAttribute("class", "nav-link");
        document.getElementById("userTable").setAttribute("class", "tab-pane active show");
        document.getElementById("nav-link-users-table").setAttribute("class", "nav-link active");
        const form = document.forms["new_user_form"];
        form.reset();
        form.elements["id-new"].value = 0;

    }
}

async function DeleteUser(id) {
    const response = await fetch("api/users/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        document.querySelector("tr[data-rowid='" + id + "']").remove();
    }
}

async function EditUser(data, id) {
    const response = await fetch("api/users/" + id, {
        method: "PATCH",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (response.ok === true) {
        const response2 = await fetch ("/api/users/" + id, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        if (response2.ok === true) {
            const user = await response2.json();
            const id_current_user = document.querySelector(".navbar-brand").getAttribute("id_user");
            if (user.id == id_current_user) {
                if (user.roleValues.includes("USER") && !user.roleValues.includes("ADMIN")) {
                    window.location.href = "/user";
                } else {
                    HeaderClear();
                    Header();
                    NavPanel(user);
                };
            }
            document.querySelector("tr[data-rowid='" + user.id + "']").replaceWith(row(user))
        }
    }
}

async function GetUsers() {
    const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const users = await response.json();
        let rows = document.getElementById("table_body_users");
        users.forEach(user => {
            rows.append(row(user));
        })
    }
};

async function Header() {
    const id_current_user = parseInt(document.querySelector(".navbar-brand").getAttribute("id_user"));
    const response = await fetch("api/users/" + id_current_user, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        headerContent(user);
    }
}

function headerContent(user) {
    const span_elem = document.querySelector(".navbar-brand");
    const b_elem = document.createElement("b");
    const text = document.createElement("text");
    const text2 = document.createElement("text");
    b_elem.append(user.email);
    text.append(" with roles ");
    text2.append(user.roleValues);
    span_elem.append(b_elem);
    span_elem.append(text);
    span_elem.append(text2);
}

function HeaderClear() {
    $(".navbar-brand").empty();

}

function NavPanel(user) {
    if (user.roleValues.includes("ADMIN") && !user.roleValues.includes("USER")) {
        document.getElementById("nav-link-user").remove();
    } else if (user.roleValues.includes("ADMIN") && user.roleValues.includes("USER")) {
        if (!document.getElementById("nav-link-user")) {
            const elem = document.querySelector("div[class='nav flex-column nav-pills me-5']");
            const userLink = document.createElement("a");
            userLink.setAttribute("class", "nav-link");
            userLink.setAttribute("id", "nav-link-user");
            userLink.setAttribute("href", "/user");
            userLink.append("User");
            elem.appendChild(userLink);
        };
    };
}

function row(user) {
    const tr = document.createElement("tr")
    tr.setAttribute("class", "user");
    tr.setAttribute("data-rowid", user.id);

    const tdId = document.createElement("td");
    tdId.append(user.id);
    tr.append(tdId)

    const tdFirstName = document.createElement("td");
    tdFirstName.append(user.firstName);
    tr.append(tdFirstName);

    const tdLastName = document.createElement("td");
    tdLastName.append(user.lastName);
    tr.append(tdLastName);

    const tdAge = document.createElement("td");
    if (user.age === null) {
        tdAge.append("")
    } else {
        tdAge.append(user.age);
    }
    tr.append(tdAge);

    const tdEmail = document.createElement("td");
    tdEmail.append(user.email);
    tr.append(tdEmail);

    const tdRoles = document.createElement("td");
    tdRoles.append(user.roleValues);
    tr.append(tdRoles);

    const tdLinkEdit = document.createElement("td");
    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", user.id);
    editLink.setAttribute("class", "btn btn-info");
    editLink.setAttribute("id", "btnEdit");
    editLink.append("Edit");
    editLink.addEventListener("click", event => {
        event.preventDefault();
        getUserEdit(user.id);
    })
    tdLinkEdit.append(editLink);
    tr.appendChild(tdLinkEdit);

    const tdLinkDelete = document.createElement("td");
    const deleteLink = document.createElement("a");
    deleteLink.setAttribute("data-id", user.id);
    deleteLink.setAttribute("class", "btn btn-danger");
    deleteLink.setAttribute("id", "btnDelete");
    deleteLink.append("Delete");
    deleteLink.addEventListener("click", event => {
        event.preventDefault();
        getUserDelete(user.id);
    });
    tdLinkDelete.append(deleteLink);
    tr.appendChild(tdLinkDelete);

    return tr;
}

async function getUserEdit(id) {
    const response = await fetch ("/api/users/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        const editForm = document.forms["editForm"];
        editForm.elements["idEdit"].value = user.id;
        editForm.elements["idHidden"].value = user.id;
        editForm.elements["firstNameEdit"].value = user.firstName;
        editForm.elements["lastNameEdit"].value = user.lastName;
        editForm.elements["ageEdit"].value = user.age;
        editForm.elements["emailEdit"].value = user.email;
        editForm.elements["passwordEdit"].value = "";
        const editModal = document.getElementById("editModal");
        let modal = new bootstrap.Modal(editModal);
        modal.show();
    }
}

async function getUserDelete(id) {
    const response = await fetch ("/api/users/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        const deleteForm = document.forms["deleteForm"];
        deleteForm.elements["idDel"].value = user.id;
        deleteForm.elements["idHiddenDel"].value = user.id;
        deleteForm.elements["firstNameDel"].value = user.firstName;
        deleteForm.elements["lastNameDel"].value = user.lastName;
        deleteForm.elements["ageDel"].value = user.age;
        deleteForm.elements["emailDel"].value = user.email;
        deleteForm.elements["passwordDel"].value = "";
        const deleteModal = document.getElementById("deleteModal");
        let modal2 = new bootstrap.Modal(deleteModal);
        modal2.show();
    }
}
