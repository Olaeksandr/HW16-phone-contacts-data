"use strict";
const CONTACTS_URL = 'http://5dd3d5ba8b5e080014dc4bfa.mockapi.io/users';
const DELETE_BTN_CLASS = 'delete-btn';
const EDIT_BTN_CLASS = 'edit-btn';


const contactNameInput = document.getElementById('addContactName');
const contactSurnameInput = document.getElementById('addContactSurname');
const contactEmailInput = document.getElementById('addContactEmail');
const contactsList = document.getElementById('contactsList');
const rowContactTemplate = document.getElementById('tdTemplate').innerHTML;
const formInputs = document.querySelectorAll('.form-input');

let contacts = [];

document.getElementById('addContactsForm').addEventListener('submit', onAddContactFormSubmit);
document.getElementById('contactsList').addEventListener('click', onRowContactList);
document.getElementById('addContactsForm').addEventListener('blur', validationBlur, true);

init();

function init() {
    getContacts();
}

function getContacts() {
    return fetch(CONTACTS_URL)
    .then(resp =>resp.json())
    .then(setContacts)
    .then(renderContacts);
}

function setContacts(data) {
    return (contacts = data);
}

function renderContacts(data) {
    contactsList.innerHTML = data.map(generateContactHTML).join('\n');
    // data.forEach(renderUser);
   
}

function generateContactHTML(contact) {
    return rowContactTemplate
    .replace('{{id}}', contact.id)
    .replace('{{name}}', contact.name)
    .replace('{{surname}}', contact.surname)
    .replace('{{email}}', contact.email);
}

function onAddContactFormSubmit(event) {
    event.preventDefault();
    if(valitadionFormAddContact()) {
        createUser();
    }
}

function valitadionFormAddContact() {
    if(contactNameInput.value.trim() !== "" &&
    contactSurnameInput.value.trim() !== "" && 
    contactEmailInput.value.trim() !== "") { 
        return true;
    }
}

function validationBlur(event) {
    switch(true) {
        case (event.target.value.trim() !== ""):
        event.target.classList.remove('error');
        break;
        case (event.target.classList.contains('input')):
        event.target.classList.add('error');
        break;   
    }
}


function createUser() {
    const contact = {
        name: contactNameInput.value, 
        surname: contactSurnameInput.value, 
        email: contactEmailInput.value,
    };

    fetch(CONTACTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(resp => resp.json())
    .then(addContact);
    clear();
}

function addContact(contact) {
    contacts.push(contact);
    renderContacts(contacts);
}

function onRowContactList(e) {
    switch(true) {
        case e.target.classList.contains(DELETE_BTN_CLASS):
            deleteContact(e.target.parentNode.parentNode.dataset.id);
            break;
        case e.target.classList.contains(EDIT_BTN_CLASS):
            editContact(e.target.parentNode.parentNode.dataset.id);
            break;
    }
}

function editContact(id) {
    const user = contacts.find(item => item.id === id);
    fillForm(user);
}

function fillForm(user) {
    for(let i=0; i<formInputs.length; i++) {
        formInputs[i].value = user[formInputs[i].name];
    }
}

function deleteContact(id) {
    fetch(`${CONTACTS_URL}/${id}`, {
        method: 'DELETE',
    });
    contacts = contacts.filter((contact) => contact.id !== id);
    renderContacts(contacts);
}

function clear() {
    addContactName.value = '';
    addContactSurname.value = '';
    addContactEmail.value = '';
}

function submitUser() {
    const user = getFormData();
    console.log(user);
    if(user.id) {
        updateUser(user);
        

    } else {
        createUser(user);
        console.log(user);
    }
    clear();
}


function getFormData() {
    const obj = {};
    for(let i=0; i<formInputs.length; i++) {
        obj[formInputs[i].name] = formInputs[i].value;
    }
    return obj;
}

function updateUser(user) {
    fetch(`${USERS_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    contacts = contacts.map(item => {item.id === user.id ? user : item});
    renderContacts(contacts);
}

