const students = [
    {
        id: '1',
        name: 'Nguyen Van Teo',
        classId: 1
    },
    {
        id: '2',
        name: 'Nguyen Van Ti',
        classId: 2
    },
    {
        id: '3',
        name: 'Tran Van Tun',
        classId: 3
    },
    {
        id: '4',
        name: 'Nguyen Thi Heo',
        classId: 1
    },
    {
        id: '5',
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

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const listStudents = [];
students.forEach(function (student) {
    const classInfo = classList.find(function (el) {
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

const tbElement = $('#tbl');

// Tiêu đề
const trElement = $('<tr></tr>');

const htmlTitle = `
        <th>ID</th>
        <th>Tên sinh viên</th>
        <th>Lớp</th>
        <th>Chức năng</th>
    `;

trElement.html(htmlTitle);
tbElement.append(trElement);

function renderStudent(student) {
    var trElement = $('<tr></tr>');
    $(trElement).attr('class', 'student-' + student.id);

    const htmlContent = `
            <td>${student.id}</td>
            <td>${student.studentName}</td>
            <td>${student.className}</td>
            <td>
                <button onclick="onUpdate('${student.id}', ${student.classId})">Sửa</button>
                <button onclick="onDelete('${student.id}')">Xóa</button>
            </td>
        `;

    trElement.html(htmlContent);
    return trElement;
}

// // Nội dung
listStudents.forEach(function (student) {
    var trElement = renderStudent(student);
    tbElement.append(trElement);
})

const classElement = $('#class');

var htmlOptions = `<option value=''>-- Chọn lớp --</option>`;
classList.forEach(function (classInfo) {
    htmlOptions += `<option value='${classInfo.id}'>${classInfo.name}</option>`;
})

classElement.html(htmlOptions);

var addBtnElement = $('#addBtn');
var edBtnElement = $("#edBtn");

const stName = $('input[name="name"]');
const classInfo = $('select[name="class"]');

addBtnElement.click(function (e) {
    e.preventDefault();

    const newSt = {
        id: generateUuid(),
        studentName: stName.val(),
        classId: Number(classInfo.val()),
        className: getClassNameById(classInfo.val())
    }

    listStudents.push(newSt);

    stName.val('');
    classInfo.val('');
    const trElement = renderStudent(newSt);

    tbElement.append(trElement);
})

var edId;
function onUpdate(id, classId) {
    edId = id;
    // Tìm sinh viên muốn sửa
    var student = listStudents.find(function (st) {
        return st.id === edId;
    })

    stName.val(student.studentName);
    classInfo.val(classId);

    $(edBtnElement).attr('style', 'display: block;');
    $(addBtnElement).attr('style', 'display: none');
}

edBtnElement.click(function (e) {
    e.preventDefault();
    const edSt = {
        id: edId,
        studentName: stName.val(),
        classId: Number(classInfo.val()),
        className: getClassNameById(classInfo.val())
    }

    var idx = listStudents.findIndex(function (student) {
        return student.id === edId;
    })
    listStudents.splice(idx, 1, edSt);

    const trElement = renderStudent(edSt);

    var editElement = $('.student-' + edId);
    if (editElement) {
        editElement.replaceWith(trElement);
    }
    stName.val('');
    classInfo.val('');
    $(edBtnElement).attr('style', 'display: none');
    $(addBtnElement).attr('style', 'display: block;');
})

function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        var idx = listStudents.findIndex(function (student) {
            return student.id === id;
        })

        if (idx !== -1) {
            listStudents.splice(idx, 1);
            var deleteElement = $('.student-' + id);
            if (deleteElement) {
                deleteElement.remove();
            }
        }
    }
}