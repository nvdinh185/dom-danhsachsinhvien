var students = [
    {
        id: '1',
        name: 'Nguyen Van Teo',
        className: 'CNTT'
    },
    {
        id: '2',
        name: 'Nguyen Van Ti',
        className: 'DTVT'
    },
    {
        id: '3',
        name: 'Tran Van Tun',
        className: 'THXD'
    },
    {
        id: '4',
        name: 'Nguyen Thi Heo',
        className: 'CNTT'
    },
    {
        id: '5',
        name: 'Le Thi Be',
        className: 'CNTT'
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

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var tbElement = $('#tbl');

// Tiêu đề
var trElement = $('<tr></tr>');

var htmlTitle = `
        <th>Tên sinh viên</th>
        <th>Lớp</th>
        <th>Chức năng</th>
    `;

trElement.html(htmlTitle);
tbElement.append(trElement);

function renderStudent(student) {
    var trElement = $('<tr></tr>');
    $(trElement).attr('class', 'student-' + student.id);

    var htmlContent = `
            <td>${student.name}</td>
            <td>${student.className}</td>
            <td>
                <button onclick="onUpdate('${student.id}')">Sửa</button>
                <button onclick="onDelete('${student.id}')">Xóa</button>
            </td>
        `;

    trElement.html(htmlContent);
    return trElement;
}

// Nội dung
students.forEach(function (student) {
    var trElement = renderStudent(student);
    tbElement.append(trElement);
})

var classElement = $('#class');

var htmlOptions = `<option value=''>-- Chọn lớp --</option>`;
classList.forEach(function (classInfo) {
    htmlOptions += `<option value='${classInfo.name}'>${classInfo.name}</option>`;
})

classElement.html(htmlOptions);

var addBtnElement = $('#create');
var edBtnElement = $("#update");

var stName = $('input[name="name"]');
var classInfo = $('select[name="class"]');

function handleBlurInput(input) {
    var errorElement = input.parent().children()[3];
    input.blur(function () {
        if (input.val() === '') {
            $(errorElement).attr('style', 'display: block; color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
        } else {
            $(errorElement).attr('style', 'display: none;');
        }
    })
}

handleBlurInput(stName);
handleBlurInput(classInfo);

addBtnElement.click(function (e) {
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
            name: stName.val(),
            className: classInfo.val()
        }

        students.push(newSt);

        stName.val('');
        classInfo.val('');
        var trElement = renderStudent(newSt);

        tbElement.append(trElement);
    }
    function isRequired(input) {
        var errorElement = input.parent().children()[3];
        if (input.val() === '') {
            Object.assign(errorElement.style, {
                display: 'block',
                color: 'red',
                fontStyle: 'italic'
            })
            $(errorElement).text('Yêu cầu nhập!');
            return true;
        } else {
            $(errorElement).attr('style', 'display: none;');
            return false;
        }
    }
})

var edId;
function onUpdate(id) {
    edId = id;
    // Tìm sinh viên muốn sửa
    var student = students.find(function (st) {
        return st.id === edId;
    })

    stName.val(student.name);
    classInfo.val(student.className);

    $(edBtnElement).attr('style', 'display: block;');
    $(addBtnElement).attr('style', 'display: none');
}

edBtnElement.click(function (e) {
    e.preventDefault();
    var edSt = {
        id: edId,
        name: stName.val(),
        className: classInfo.val()
    }

    var idx = students.findIndex(function (student) {
        return student.id === edId;
    })
    students.splice(idx, 1, edSt);

    var trElement = renderStudent(edSt);

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
        var idx = students.findIndex(function (student) {
            return student.id === id;
        })

        if (idx !== -1) {
            students.splice(idx, 1);
            var deleteElement = $('.student-' + id);
            if (deleteElement) {
                deleteElement.remove();
            }
        }
    }
}