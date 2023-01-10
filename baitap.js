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

console.table(listStudents);

const tbElement = document.querySelector('#tbl');

// Tiêu đề
const tr1Element = document.createElement('tr');

const th1Element = document.createElement('th');
th1Element.innerText = 'ID';
tr1Element.appendChild(th1Element);
const th2Element = document.createElement('th');
th2Element.innerText = 'Tên sinh viên';
tr1Element.appendChild(th2Element);
const th3Element = document.createElement('th');
th3Element.innerText = 'Lớp';
tr1Element.appendChild(th3Element);
tbElement.appendChild(tr1Element);

// Nội dung
listStudents.forEach(function (student) {
    const tr2Element = document.createElement('tr');
    const td1Element = document.createElement('td');
    td1Element.innerText = student.id;
    tr2Element.appendChild(td1Element);
    const td2Element = document.createElement('td');
    td2Element.innerText = student.studentName;
    tr2Element.appendChild(td2Element);
    const td3Element = document.createElement('td');
    td3Element.innerText = student.className;
    tr2Element.appendChild(td3Element);

    tbElement.appendChild(tr2Element);

})