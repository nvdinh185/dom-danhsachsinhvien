var studentsApi = "http://localhost:3000/student";
var classApi = "http://localhost:3000/class";

async function render() {
    var tbElement = $('#tbl');

    try {
        var listStudents = await axios.get(studentsApi);
        listStudents = listStudents.data;

        // Tiêu đề
        var htmls = `
        <thead>
            <tr>
                <th>Tên sinh viên</th>
                <th>Lớp</th>
                <th>Chức năng</th>
            </tr>
        </thead>
        `;

        // Nội dung
        htmls += '<tbody>';
        for (const student of listStudents) {
            var trElement = renderStudent(student);
            htmls += trElement;
        }
        htmls += '</tbody>';
        tbElement.html(htmls);

        // display class in select option
        var classList = await axios.get(classApi);
        classList = classList.data;
        var classElement = $('#class');

        var htmlOptions = `<option value=''>-- Chọn lớp --</option>`;
        classList.forEach(function (classInfo) {
            htmlOptions += `<option value='${classInfo.id}'>${classInfo.name}</option>`;
        })

        classElement.html(htmlOptions);
    } catch (error) {
        errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi lấy dữ liệu!</p>');
    }
}

render();

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

var addBtnElement = $('#create');
var editBtnElement = $('#update');

var stName = $('input[name="name"]');
var classInfo = $('select[name="class"]');

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
    var errorElement = input.parent().children()[3];
    input.blur(function () {
        if (input.val().trim() === '') {
            $(errorElement).attr('style', 'color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
        }
    })

    input.on('input', function () {
        $(errorElement).attr('style', 'display: none;');
        input.removeClass('invalid');
    })
}

handleBlurInput(stName);
handleBlurInput(classInfo);

addBtnElement.on('click', function (e) {
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
            studentName: stName.val(),
            classId: Number(classInfo.val()),
            className: getClassNameById(classInfo.val())
        }

        listStudents.push(newSt);
        render(listStudents);

        stName.val('');
        classInfo.val('');
    }

    function isRequired(input) {
        var errorElement = input.parent().children()[3];
        if (input.val().trim() === '') {
            $(errorElement).attr('style', 'color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
            return true;
        }
    }
})

var idEd;
function onUpdate(id) {
    idEd = id;
    // Tìm sinh viên muốn sửa
    var student = listStudents.find(function (st) {
        return st.id === idEd;
    })

    stName.val(student.studentName);
    classInfo.val(student.classId);

    addBtnElement.attr('style', 'display: none');
    editBtnElement.attr('style', 'display: block');
}

editBtnElement.on('click', function (e) {
    e.preventDefault();
    var edSt = {
        id: idEd,
        studentName: stName.val(),
        classId: classInfo.val(),
        className: getClassNameById(classInfo.val())
    }

    var idx = listStudents.findIndex(function (student) {
        return student.id === idEd;
    })
    listStudents.splice(idx, 1, edSt);
    render(listStudents);

    addBtnElement.attr('style', 'display: block');
    editBtnElement.attr('style', 'display: none');
    stName.val('');
    classInfo.val('');
})

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