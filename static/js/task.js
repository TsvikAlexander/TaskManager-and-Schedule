import { checkBtn } from '/static/js/utils.js';

const modalEditTask = document.querySelector('#modal-edit-task');
const modalFormEditTask = modalEditTask.querySelector('#form-edit-task');
const inputEditTitle = modalFormEditTask.querySelector('#edit-title');
const inputEditDescription = modalFormEditTask.querySelector('#edit-description');

const modalDeleteTask = document.querySelector('#modal-delete-task');
const linkDeleteTask = modalDeleteTask.querySelector('.modal-footer a');
const modalBodyDeleteTask = modalDeleteTask.querySelector('div.modal-body');
const fieldsDeleteTask = modalBodyDeleteTask.children;

const classes = {
    'btn-not-completed': taskNotCompleted,
    'btn-completed': taskCompleted,
    'btn-edit': taskEdit,
    'btn-delete': taskDelete
};

const keysClasses = Object.keys(classes);

document.body.addEventListener('click', function(event) {
    for (let i = 0; i < keysClasses.length; i++) {
        let elem = checkBtn(event.target, keysClasses[i]);

        if (elem) {
            let id = elem.parentNode.dataset.taskId;
            classes[keysClasses[i]](elem, id);

            break;
        }
    }
});


function taskNotCompleted(btn, id) {
    window.location.href = `/task/${id}?operation=not-completed`;
}

function taskCompleted(btn, id) {
    window.location.href = `/task/${id}?operation=completed`;
}

function taskEdit(btn, id) {
    let description = btn.parentNode.parentNode.previousElementSibling;
    let title = description.previousElementSibling;

    inputEditTitle.value = title.textContent.trim();
    inputEditDescription.value = description.textContent.trim();

    modalFormEditTask.action = `/task/${id}?operation=edit`;
}

function taskDelete(btn, id) {
    let container = btn.parentNode.parentNode.parentNode;

    modalBodyDeleteTask.style.backgroundColor = container.style.backgroundColor;
    modalBodyDeleteTask.style.color = container.style.color;

    let date = btn.parentNode.previousElementSibling;
    let description = btn.parentNode.parentNode.previousElementSibling;
    let title = description.previousElementSibling;

    fieldsDeleteTask[0].innerHTML = title.textContent.trim();
    fieldsDeleteTask[1].innerHTML = description.textContent.trim();
    fieldsDeleteTask[2].innerHTML = date.textContent.trim();

    linkDeleteTask.href = `/task/${id}?operation=delete`;
}