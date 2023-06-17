var studentsApi = "http://localhost:3000/student";
var classApi = "http://localhost:3000/class";
var tbElement = $('#tbl');

async function getData() {
    var listStudents = await axios.get(studentsApi);
    listStudents = listStudents.data;

    // Tiêu đề
    var trElement = $('<tr></tr>');

    var htmlTitle = `
        <th>Tên sinh viên</th>
        <th>Lớp</th>
        <th>Chức năng</th>
    `;

    trElement.html(htmlTitle);
    tbElement.html(trElement);

    // Nội dung
    listStudents.forEach(function (student) {
        var trElement = renderStudent(student);
        tbElement.append(trElement);
    })

    // display class in select option
    var classList = await axios.get(classApi);
    classList = classList.data;
    var classElement = $('#class');

    var htmlOptions = `<option value=''>-- Chọn lớp --</option>`;
    classList.forEach(function (classInfo) {
        htmlOptions += `<option value='${classInfo.id}'>${classInfo.name}</option>`;
    })

    classElement.html(htmlOptions);
}

getData();

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

addBtnElement.click(async function (e) {
    e.preventDefault();

    var check = true;
    if (validation(stName)) {
        check = false;
    }
    if (validation(classInfo)) {
        check = false;
    }
    if (check) {
        var newSt = {
            id: generateUuid(),
            name: stName.val(),
            classId: classInfo.val()
        }

        await axios({
            method: "POST",
            url: studentsApi + '/add',
            data: newSt,
            headers: { "Content-Type": "application/json" },
        })

        stName.val('');
        classInfo.val('');
        // Lấy sinh viên mới thêm vào
        var student = await axios.get(studentsApi + '/' + newSt.id);
        student = student.data;
        var trElement = renderStudent(student);
        tbElement.append(trElement);

    }
    function validation(input) {
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

    function generateUuid() {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
})

var edId;
async function onUpdate(id) {
    edId = id;
    // Lấy sinh viên muốn sửa
    var student = await axios.get(studentsApi + '/' + id);
    student = student.data;

    stName.val(student.name);
    classInfo.val(student.classId);

    $(edBtnElement).attr('style', 'display: block;');
    $(addBtnElement).attr('style', 'display: none');
}

edBtnElement.click(async function (e) {
    e.preventDefault();
    var edSt = {
        id: edId,
        name: stName.val(),
        classId: classInfo.val()
    }

    await axios({
        method: "PUT",
        url: studentsApi + '/' + edId,
        data: edSt,
        headers: { "Content-Type": "application/json" },
    })

    // Lấy sinh viên mới sửa
    var student = await axios.get(studentsApi + '/' + edId);
    student = student.data;
    var trElement = renderStudent(student);
    var studentElement = $('.student-' + edId);
    if (studentElement) {
        studentElement.replaceWith(trElement);
    }

    stName.val('');
    classInfo.val('');
    $(edBtnElement).attr('style', 'display: none');
    $(addBtnElement).attr('style', 'display: block;');
})

async function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {

        await axios({
            method: "DELETE",
            url: studentsApi + '/' + id,
            headers: { "Content-Type": "application/json" }
        })

        var studentElement = $('.student-' + id);
        if (studentElement) {
            studentElement.remove();
        }
    }
}