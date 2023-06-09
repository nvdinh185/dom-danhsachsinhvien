const studentsApi = "http://localhost:3000/student";
const classApi = "http://localhost:3000/class";

async function getData() {
    var listStudents = await axios.get(studentsApi);
    listStudents = listStudents.data;

    // Tiêu đề
    const trElement = $('<tr></tr>');

    const htmlTitle = `
    <th>Tên sinh viên</th>
    <th>Lớp</th>
    <th>Chức năng</th>
    `;

    const tbElement = $('#tbl');
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
    const classElement = $('#class');

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

    const htmlContent = `
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

const stName = $('input[name="name"]');
const classInfo = $('select[name="class"]');

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
        const newSt = {
            id: generateUuid(),
            name: stName.val(),
            classId: classInfo.val()
        }

        await axios({
            method: "POST",
            url: studentsApi + '/add',
            data: JSON.stringify(newSt),
            headers: { "Content-Type": "application/json" },
        })

        stName.val('');
        classInfo.val('');
        getData();
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
    const edSt = {
        id: edId,
        name: stName.val(),
        classId: classInfo.val()
    }

    await axios({
        method: "PUT",
        url: studentsApi + '/' + edId,
        data: JSON.stringify(edSt),
        headers: { "Content-Type": "application/json" },
    })

    getData();
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

        getData();
    }
}