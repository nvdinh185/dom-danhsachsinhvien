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

const tbElement = $('#tbl');

// Tiêu đề
const tr1Element = $('<tr></tr>');

const htmlTitle = `
        <th>ID</th>
        <th>Tên sinh viên</th>
        <th>Lớp</th>
        <th>Chức năng</th>
    `;

tr1Element.html(htmlTitle);
tbElement.append(tr1Element);

function renderStudent(student) {
    var trElement = $('<tr></tr>');
    $(trElement).attr('class', 'student-' + student.id);

    const htmlContent = `
            <td>${student.id}</td>
            <td>${student.studentName}</td>
            <td>${student.className}</td>
            <td>
                <button onclick="onUpdate(${student.id}, ${student.classId})">Sửa</button>
                <button onclick="onDelete(${student.id})">Xóa</button>
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
    htmlOptions += `
            <option value='${classInfo.id}'>${classInfo.name}</option>
        `;
})

classElement.html(htmlOptions);

var addBtnElement = $('#addBtn');

const stName = $('input[name="name"]');
const classInfo = $('select[name="class"]');

addBtnElement.click(function (e) {
    e.preventDefault();

    const newSt = {
        id: listStudents.length + 1,
        studentName: stName.val(),
        classId: Number(classInfo.val()),
        className: getClassNameById(classInfo.val())
    }

    listStudents.push(newSt);

    stName.val('');
    classInfo.val('');
    const tr3Element = renderStudent(newSt);

    tbElement.append(tr3Element);
})

function onUpdate(id, classId) {
    // Tìm sinh viên muốn sửa
    var student = listStudents.find(function (st) {
        return st.id === id;
    })

    stName.val(student.studentName);
    classInfo.val(classId);

    var edBtnElement = $("#edBtn");
    $(edBtnElement).attr('style', 'display: block;');
    $(addBtnElement).attr('style', 'display: none');

    edBtnElement.click(function (e) {
        e.preventDefault();
        const edSt = {
            id,
            studentName: stName.val(),
            classId: Number(classInfo.val()),
            className: getClassNameById(classInfo.val())
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

        var editElement = $('.student-' + id);
        if (editElement) {
            editElement.html(htmls);
        }
        $(edBtnElement).attr('style', 'display: none');
        $(addBtnElement).attr('style', 'display: block;');
        stName.val('');
        classInfo.val('');
    })
}

function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        var idx = listStudents.findIndex(function (student) {
            return student.id === id;
        })

        if (idx !== -1) {
            listStudents.splice(idx, 1);
        }
        var deleteElement = $('.student-' + id);
        if (deleteElement) {
            deleteElement.remove();
        }
    }
}