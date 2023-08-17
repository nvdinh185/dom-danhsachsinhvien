var students = [
    {
        id: '1',
        name: 'Nguyen Van Teo',
        classId: '1'
    },
    {
        id: '2',
        name: 'Nguyen Van Ti',
        classId: '2'
    },
    {
        id: '3',
        name: 'Tran Van Tun',
        classId: '3'
    },
    {
        id: '4',
        name: 'Nguyen Thi Heo',
        classId: '1'
    },
    {
        id: '5',
        name: 'Le Thi Be',
        classId: '1'
    }
]

var classList = [
    {
        id: '1',
        name: "CNTT"
    },
    {
        id: '2',
        name: 'DTVT'
    },
    {
        id: '3',
        name: 'THXD'
    },
    {
        id: '4',
        name: 'XDDD'
    }
]

function getClassNameById(id) {
    return classList.find(function (el) {
        return el.id === id;
    }).name;
}

function renderHTML(arr, tbEl) {

    // Tiêu đề
    var htmlTitle = '';
    for (const key in arr[0]) {
        htmlTitle += `<th>${key}</th>`;
    }
    htmlTitle += `<th colspan=2>Chức năng</th>`;

    tbEl.innerHTML = '<thead><tr>' + htmlTitle + '</tr></thead>';

    // Nội dung
    var htmlBody = '<tbody>';
    arr.forEach(function (el) {
        var htmlContent = '<tr>';
        for (const key in el) {
            htmlContent += `<td>${el[key]}</td>`;
        }
        htmlContent += `<td><button onclick=editSt('${el.id}')>Sửa</button></td>`;
        htmlContent += `<td><button onclick=deleteSt('${el.id}')>Xóa</button></td>`;
        htmlContent += '</tr>';
        htmlBody += htmlContent;
    })
    htmlBody += '</tbody>';
    tbEl.innerHTML += htmlBody;
}

var listStudents = [];
students.forEach(function (student) {
    var classInfo = classList.find(function (el) {
        return el.id === student.classId;
    })
    var newSt = {
        id: student.id,
        studentName: student.name,
        classId: classInfo.id,
        className: classInfo.name
    }
    listStudents.push(newSt);
})

const tbElement = document.querySelector('#tbl');

renderHTML(listStudents, tbElement);

var classElement = document.querySelector('#class');

var htmlOptions = `<option value=''>-- Chọn lớp --</option>`;
classList.forEach(function (classInfo) {
    htmlOptions += `
            <option value='${classInfo.id}'>${classInfo.name}</option>
        `;
})

classElement.innerHTML = htmlOptions;

var addBtnElement = document.getElementById('create');
var editBtnElement = document.getElementById('update');

var stName = document.querySelector('input[name="name"]');
var classInfo = document.querySelector('select[name="class"]');

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function handleBlurInput(input) {
    var errorElement = input.parentElement.querySelector('.form-message');
    input.onblur = function () {
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'display: block; color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
        } else {
            errorElement.setAttribute('style', 'display: none;');
        }
    }

    input.oninput = function () {
        errorElement.setAttribute('style', 'display: none;');
        input.classList.remove('invalid');
    }
}

handleBlurInput(stName);
handleBlurInput(classInfo);

addBtnElement.onclick = function (e) {
    e.preventDefault();

    var check = true;
    if (isRequired(stName)) {
        check = false;
    }
    if (isRequired(classInfo)) {
        check = false;
    }
    if (check) {

        var newSt = {
            id: generateUuid(),
            studentName: stName.value,
            classId: Number(classInfo.value),
            className: getClassNameById(classInfo.value)
        }

        listStudents.push(newSt);
        renderHTML(listStudents, tbElement);

        stName.value = '';
        classInfo.value = '';
    }

    function isRequired(input) {
        var errorElement = input.parentElement.querySelector('.form-message');
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'display: block; color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
            return true;
        } else {
            errorElement.setAttribute('style', 'display: none;');
            return false;
        }
    }
}

var edId;
function editSt(id) {
    edId = id;

    var idx = listStudents.findIndex(function (el) {
        return el.id == id;
    })
    stName.value = listStudents[idx].studentName;
    classInfo.value = listStudents[idx].classId;

    addBtnElement.setAttribute('style', 'display: none');
    editBtnElement.setAttribute('style', 'display: block');
}

editBtnElement.onclick = function (e) {
    e.preventDefault();
    var edSt = {
        id: edId,
        studentName: stName.value,
        classId: classInfo.value,
        className: getClassNameById(classInfo.value)
    }

    var idx = listStudents.findIndex(function (student) {
        return student.id === edId;
    })
    listStudents.splice(idx, 1, edSt);
    renderHTML(listStudents, tbElement);

    addBtnElement.setAttribute('style', 'display: block');
    editBtnElement.setAttribute('style', 'display: none');
    stName.value = '';
    classInfo.value = '';
}

function deleteSt(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        var idx = listStudents.findIndex(function (el) {
            return el.id == id;
        })

        listStudents.splice(idx, 1);
        renderHTML(listStudents, tbElement);
    }
}