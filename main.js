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

function render(array) {
    var tbElement = document.querySelector('#tbl');

    // Tiêu đề
    var htmlTitle = `
        <thead>
            <tr>
                <th>Tên sinh viên</th>
                <th>Lớp</th>
                <th>Chức năng</th>
            </tr>
        </thead>
        `;

    tbElement.innerHTML = htmlTitle;

    // Nội dung
    var htmlBody = '<tbody>';
    for (const student of array) {
        var trElement = renderStudent(student);
        htmlBody += trElement;
    }
    htmlBody += '</tbody>';
    tbElement.innerHTML += htmlBody;
}

render(listStudents);

function renderStudent(student) {
    var htmls = `
        <tr>
                <td>${student.studentName}</td>
                <td>${student.className}</td>
                <td>
                    <button onclick="onUpdate('${student.id}')">Sửa</button>
                    <button onclick="onDelete('${student.id}')">Xóa</button>
                </td>
        </tr>
        `;

    return htmls;
}

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

/**
 * Hàm để xử lý khi blur hoặc nhập vào ô input
 * @param {*} input 
 */
function handleBlurInput(input) {
    var errorElement = input.parentElement.querySelector('.form-message');
    input.onblur = function () {
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
            input.classList.add('invalid');
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
        render(listStudents);

        stName.value = '';
        classInfo.value = '';
    }

    function isRequired(input) {
        var errorElement = input.parentElement.querySelector('.form-message');
        if (input.value.trim() === '') {
            errorElement.setAttribute('style', 'color: red; font-style: italic;');
            errorElement.innerText = 'Yêu cầu nhập!';
            input.classList.add('invalid');
            return true;
        }
    }
}

var idEd;
function onUpdate(id) {
    idEd = id;
    // Tìm sinh viên muốn sửa
    var student = listStudents.find(function (st) {
        return st.id === idEd;
    })

    stName.value = student.studentName;
    classInfo.value = student.classId;

    addBtnElement.setAttribute('style', 'display: none');
    editBtnElement.setAttribute('style', 'display: block');
}

editBtnElement.onclick = function (e) {
    e.preventDefault();
    var edSt = {
        id: idEd,
        studentName: stName.value,
        classId: classInfo.value,
        className: getClassNameById(classInfo.value)
    }

    var idx = listStudents.findIndex(function (student) {
        return student.id === idEd;
    })
    listStudents.splice(idx, 1, edSt);
    render(listStudents);

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

        render(listStudents);
    }
}