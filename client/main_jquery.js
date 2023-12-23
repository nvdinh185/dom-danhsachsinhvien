var studentsApi = "http://localhost:3000/students";
var classApi = "http://localhost:3000/classList";

var errorElement = $('.error');
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
            htmlOptions += `<option value='${classInfo.name}'>${classInfo.name}</option>`;
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
                <td>${student.name}</td>
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

addBtnElement.on('click', async function (e) {
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

        try {
            await axios({
                method: "POST",
                url: studentsApi,
                data: newSt
            })
            render();

            stName.val('');
            classInfo.val('');
        } catch (error) {
            errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi thêm!</p>');
        }
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

var edId;
async function onUpdate(id) {
    edId = id;
    // Lấy sinh viên muốn sửa
    try {
        var edSt = await axios.get(studentsApi + '/' + id);
        edSt = edSt.data;

        stName.val(edSt.name);
        classInfo.val(edSt.className);

        $(editBtnElement).attr('style', 'display: block;');
        $(addBtnElement).attr('style', 'display: none');
    } catch (error) {
        errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi lấy dữ liệu để sửa!</p>');
    }
}

editBtnElement.click(async function (e) {
    e.preventDefault();
    var edSt = {
        id: edId,
        name: stName.val(),
        className: classInfo.val()
    }

    try {
        await axios({
            method: "PUT",
            url: studentsApi + '/' + edId,
            data: edSt
        })
        render();

        stName.val('');
        classInfo.val('');
        $(editBtnElement).attr('style', 'display: none');
        $(addBtnElement).attr('style', 'display: block;');
    } catch (error) {
        errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi sửa!</p>');
    }
})

async function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        try {
            await axios({
                method: "DELETE",
                url: studentsApi + '/' + id
            })

            render();
        } catch (error) {
            errorElement.html('<p style="color: red; font-style: italic">Xảy ra lỗi khi xóa!</p>');
        }
    }
}