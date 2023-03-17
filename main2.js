const students = [
    {
        id: 1,
        name: 'Nguyen Van Teo',
        classId: 1
    },
    {
        id: 2,
        name: 'Nguyen Van Ti',
        classId: 2
    },
    {
        id: 3,
        name: 'Tran Van Tun',
        classId: 3
    },
    {
        id: 4,
        name: 'Nguyen Thi Heo',
        classId: 1
    },
    {
        id: 5,
        name: 'Le Thi Be',
        classId: 1
    }
]

const classList = [
    {
        id: 1,
        name: "CNTT"
    },
    {
        id: 2,
        name: 'DTVT'
    },
    {
        id: 3,
        name: 'THXD'
    },
    {
        id: 4,
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
        return el.id === Number(id);
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
    const it = {
        id: student.id,
        studentName: student.name,
        classId: classInfo.id,
        className: classInfo.name
    }
    listStudents.push(it);
})

const tbElement = document.querySelector('#tbl');

// Tiêu đề
const tr1Element = document.createElement('tr');

const htmlTitle = `
        <th>ID</th>
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
            <td>${student.id}</td>
            <td>${student.studentName}</td>
            <td>${student.className}</td>
            <td>
                <button onclick="onUpdate(${student.id}, ${student.classId})">Sửa</button>
                <button onclick="onDelete(${student.id})">Xóa</button>
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

var addBtnElement = document.getElementById('addBtn');

const stName = document.querySelector('input[name="name"]');
const classInfo = document.querySelector('select[name="class"]');

addBtnElement.onclick = function (e) {
    e.preventDefault();

    const newSt = {
        id: listStudents.length + 1,
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

function onUpdate(id, classId) {
    // Tìm sinh viên muốn sửa
    var student = listStudents.find(function (st) {
        return st.id === id;
    })

    stName.value = student.studentName;
    var arrOptionElement = classElement.getElementsByTagName('option');
    for (const option of arrOptionElement) {
        if (Number(option.value) === classId) {
            option.setAttribute("selected", "selected");
            classInfo.value = classId;
        } else {
            option.removeAttribute("selected");
        }
    }

    var editBtnElement = document.createElement('button');
    editBtnElement.id = 'updateBtn';
    editBtnElement.innerText = 'Sửa';
    if (!document.getElementById('updateBtn')) {
        addBtnElement.parentElement.appendChild(editBtnElement);
        addBtnElement.remove();
    }

    editBtnElement.onclick = function (e) {
        const edSt = {
            id,
            studentName: stName.value,
            classId: Number(classInfo.value),
            className: getClassNameById(classInfo.value)
        }

        var idx = listStudents.findIndex(function (student) {
            return student.id === id;
        })
        listStudents.splice(idx, 1, edSt);

        const htmls = `
                <td>${edSt.id}</td>
                <td>${edSt.studentName}</td>
                <td>${edSt.className}</td>
                <td>
                    <button onclick="onUpdate(${edSt.id}, ${edSt.classId})">Sửa</button>
                    <button onclick="onDelete(${edSt.id})">Xóa</button>
                </td>
            `;

        var editElement = document.querySelector('.student-' + id);
        if (editElement) {
            editElement.innerHTML = htmls;
        }
        editBtnElement.parentElement.appendChild(addBtnElement);
        editBtnElement.remove();
        stName.value = '';
        classInfo.value = '';
    }
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