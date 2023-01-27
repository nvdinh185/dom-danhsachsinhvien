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

// Nội dung
listStudents.forEach(function (student) {
    const tr2Element = document.createElement('tr');

    const htmlContent = `
        <td>${student.id}</td>
        <td>${student.studentName}</td>
        <td>${student.className}</td>
        <td>
            <button>Sửa</button>
            <button>Xóa</button>
        </td>
    `;

    tr2Element.innerHTML = htmlContent;

    tbElement.appendChild(tr2Element);

})

const className = document.querySelector('#class');

var htmlOptions = `<option value=''>-- Chọn lớp --</option>`;
classList.forEach(function (className) {
    htmlOptions += `
        <option value='${className.id}'>${className.name}</option>
    `;
})

className.innerHTML = htmlOptions;

const inputForm = document.forms.myform;

inputForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const stName = document.querySelector('input[name="name"]');
    const className = document.querySelector('select[name="class"]');

    const newSt = {
        id: listStudents.length + 1,
        studentName: stName.value,
        className: getClassNameById([className.value])
    }

    listStudents.push(newSt);
    stName.value = '';
    className.value = '';
    const tr3Element = document.createElement('tr');

    const htmls = `
        <td>${newSt.id}</td>
        <td>${newSt.studentName}</td>
        <td>${newSt.className}</td>
        <td>
            <button>Sửa</button>
            <button>Xóa</button>
        </td>
    `;

    tr3Element.innerHTML = htmls;

    tbElement.appendChild(tr3Element);
})