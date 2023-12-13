$('document').ready(function() {
    GetUserByName();
});

async function GetUserByName() {
    const username = document.getElementById("username-current-user").textContent;
    const response = await fetch("/api/users/" + username, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        let row = document.getElementById("table-body-user");
        row.append(rowOne(user));
    }
}

function rowOne(user) {
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

    return tr;
}

