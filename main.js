const students = [
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

const classList = [
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

function getClassByIds(classIds) {
    return classList.filter(function (el) {
        return classIds.includes(el.id);
    })
}

function getClassNameById(id) {
    return classList.find(function (el) {
        return el.id === id;
    }).name;
}

const classIds = students.map(function (student) {
    return student.classId;
})

const classByIds = getClassByIds(classIds);
// console.log(classByIds);

const listStudents = [];
students.forEach(function (student) {
    const classInfo = classByIds.find(function (el) {
        return el.id === student.classId;
    })
    const newSt = {
        id: student.id,
        studentName: student.name,
        classId: classInfo.id,
        className: classInfo.name
    }
    listStudents.push(newSt);
})

const tbElement = document.querySelector('#tbl');

// Tiêu đề
const tr1Element = document.createElement('tr');

const htmlTitle = `
        <th>Tên sinh viên</th>
        <th>Lớp</th>
        <th>Chức năng</th>
    `;

tr1Element.innerHTML = htmlTitle;
tbElement.appendChild(tr1Element);

function renderStudent(student) {
    var trElement = document.createElement('tr');
    trElement.setAttribute('class', 'student-' + student.id);

    const htmlContent = `
            <td>${student.studentName}</td>
            <td>${student.className}</td>
            <td>
                <button onclick="onUpdate('${student.id}', '${student.classId}')">Sửa</button>
                <button onclick="onDelete('${student.id}')">Xóa</button>
            </td>
        `;

    trElement.innerHTML = htmlContent;
    return trElement;
}

// Nội dung
listStudents.forEach(function (student) {
    var trElement = renderStudent(student);
    tbElement.appendChild(trElement);
})

const classElement = document.querySelector('#class');

var htmlOptions = `<option value=''>-- Chọn lớp --</option>`;
classList.forEach(function (classInfo) {
    htmlOptions += `
            <option value='${classInfo.id}'>${classInfo.name}</option>
        `;
})

classElement.innerHTML = htmlOptions;

var addBtnElement = document.getElementById('create');
var editBtnElement = document.getElementById('update');

const stName = document.querySelector('input[name="name"]');
const classInfo = document.querySelector('select[name="class"]');

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function handleBlurInput(input) {
    var errorElement = input.parentElement.querySelector('.form-message');
    input.onblur = function () {
        if (input.value === '') {
            errorElement.setAttribute('style', 'display: block; color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
        } else {
            errorElement.setAttribute('style', 'display: none;');
        }
    }
}


handleBlurInput(stName);
handleBlurInput(classInfo);

addBtnElement.onclick = function (e) {
    e.preventDefault();

    var check = true;
    if (validation(stName)) {
        check = false;
    }
    if (validation(classInfo)) {
        check = false;
    }
    if (check) {

        const newSt = {
            id: generateUuid(),
            studentName: stName.value,
            classId: Number(classInfo.value),
            className: getClassNameById(classInfo.value)
        }

        listStudents.push(newSt);

        stName.value = '';
        classInfo.value = '';
        const tr3Element = renderStudent(newSt);

        tbElement.appendChild(tr3Element);
    }

    function validation(input) {
        var errorElement = input.parentElement.querySelector('.form-message');
        if (input.value === '') {
            Object.assign(errorElement.style, {
                display: 'block',
                color: 'red',
                fontStyle: 'italic'
            })
            errorElement.innerText = 'Yêu cầu nhập!';
            return true;
        } else {
            errorElement.setAttribute('style', 'display: none;');
            return false;
        }
    }
}

var idEd;
function onUpdate(id, classId) {
    idEd = id;
    // Tìm sinh viên muốn sửa
    var student = listStudents.find(function (st) {
        return st.id === idEd;
    })

    stName.value = student.studentName;
    classInfo.value = classId;

    addBtnElement.setAttribute('style', 'display: none');
    editBtnElement.setAttribute('style', 'display: block');
}

editBtnElement.onclick = function (e) {
    e.preventDefault();
    const edSt = {
        id: idEd,
        studentName: stName.value,
        classId: Number(classInfo.value),
        className: getClassNameById(classInfo.value)
    }

    var idx = listStudents.findIndex(function (student) {
        return student.id === idEd;
    })
    listStudents.splice(idx, 1, edSt);

    const htmls = `
                <td>${edSt.studentName}</td>
                <td>${edSt.className}</td>
                <td>
                    <button onclick="onUpdate('${edSt.id}', '${edSt.classId}')">Sửa</button>
                    <button onclick="onDelete('${edSt.id}')">Xóa</button>
                </td>
            `;

    var editElement = document.querySelector('.student-' + idEd);
    if (editElement) {
        editElement.innerHTML = htmls;
    }
    addBtnElement.setAttribute('style', 'display: block');
    editBtnElement.setAttribute('style', 'display: none');
    stName.value = '';
    classInfo.value = '';
}

function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        var idx = listStudents.findIndex(function (student) {
            return student.id === id;
        })

        if (idx !== -1) {
            listStudents.splice(idx, 1);
        }
        var deleteElement = document.querySelector('.student-' + id);
        if (deleteElement) {
            deleteElement.remove();
        }
    }
}