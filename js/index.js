(function () {
    var flag = true;
    function init() {
        bindEvent();
    }
    init();

    function bindEvent() {
        //文件上传按钮
        $('#myfile').click(function () {
            $('#upload').click();
        });

        checkForm();
        // 表单提交事件
        $('#submit-student-form').on('submit', function (event) {
            event.preventDefault();
            postData();
            if (flag) {
                var name = $('#name').val();
                var oClass = $('#oClass').val();
                var id = $('#id').val();
                var email = $('#email').val();
                var telephone = $('#telephone').val();
                var sex = $("input[name='sex']:checked").val();//获取性别
                var teacher = $("select option:selected").val();
                var filenameArr = $('#upload').val().split('\\');//获取文件名
                var filename = filenameArr[filenameArr.length - 1];

                var student = {
                    oClass: oClass,
                    name: name,
                    studentId: id,
                    sex: sex,
                    email: email,
                    telephone: telephone,
                    teacher: teacher,
                    filename: filename
                };

                alert(JSON.stringify(student));

                $.ajax({
                    url: '/api/create',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(student),
                    success: function (response) {
                        layui.use('layer', function () {
                            var layer = layui.layer;
                            layer.msg('提交成功', { icon: 1 });
                        });
                        $('#submit-student-form')[0].reset();
                    }
                });
            }
        });

        // a标签点击事件——锚点平滑过渡
        $(function () {
            $('a').click(function () {
                //根据a标签的href转换为id选择器，获取id元素所处的位置，并高度减50px（这里根据需要自由设置）
                $('html,body').animate({
                    scrollTop: ($($(this).attr('href')).offset().top)
                }, 1000);
            });
        });

        //小圆点
        $(".join").click(function () {
            $(this).addClass('disppear');
        });
    }

    //上传文件
    function postData() {
        var fileObj = document.getElementById("upload").files[0];
        if (typeof (fileObj) == "undefined" || fileObj.size <= 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.msg('请在附件中上传个人简历或作品', { icon: 0 });
            });
            flag = false;
            return flag;
        } else {
            flag = true;
        }
        var formData = new FormData();
        formData.append("file", fileObj);
        $.ajax({
            url: '/api/upload',
            type: "POST",
            data: formData,
            async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
            }
        });
    }

    //封装校验器
    function checkForm() {
        //验证用户唯一性
        $("#id").blur(function () {
            var studentId = $(this).val();
            $.ajax({
                url: '/api/findByStudentId',
                type: 'POST',
                data: { studentId: JSON.stringify(studentId) },
                dataType: 'text',
                success: function (data) {
                    if (data == '1') {
                        //存在
                        layui.use('layer', function () {
                            var layer = layui.layer;
                            layer.tips('您已报名!', '#id', {
                                tips: [2, '#EB4549'],
                                anim: 6,
                                time: 0
                            });
                        });
                        flag = false;
                        $('#name').attr("disabled", true);
                        $('#email').attr("disabled", true);
                        $('#telephone').attr("disabled", true);
                        $('select').attr("disabled", true);
                    } else {
                        //不存在      
                        flag = true;
                        $('#name').attr("disabled", false);
                        $('#email').attr("disabled", false);
                        $('#telephone').attr("disabled", false);
                        $('select').attr("disabled", false);
                        successCallback();
                    };
                },
                error: function () {
                    console.log('失败回调函数');
                }
            });
            return flag;
        });
    }

    function successCallback() {
        //姓名
        $("#name").blur(function () {
            var nameReg = /^[\W\*]{2,4}$/;
            if (!nameReg.test($('#name').val())) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.tips('姓名为2~4位的中文字符', '#name', {
                        tips: [2, '#EB4549'],
                        anim: 6
                    });
                });
                flag = false;
                $('#email').attr("disabled", true);
                $('#telephone').attr("disabled", true);
                $('select').attr("disabled", true);
                $(this).focus(function () {
                    $(this).val("");
                });
            } else {
                flag = true;
                $('#email').attr("disabled", false);
                $('#telephone').attr("disabled", false);
                $('select').attr("disabled", false);
                // //邮箱
                $("#email").blur(function () {
                    var emailReg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
                    if (emailReg.test($('input[name=email]').val()) == false) {
                        layui.use('layer', function () {
                            var layer = layui.layer;
                            layer.tips('邮箱应为 XX@XX.com/.cn的格式', '#email', {
                                tips: [2, '#EB4549'],
                                anim: 6
                            });
                        });
                        flag = false;
                        $('#telephone').attr("disabled", true);
                        $('select').attr("disabled", true);
                        $(this).focus(function () {
                            $(this).val("");
                        });
                    } else {
                        flag = true;
                        // //手机号码
                        $('#telephone').attr("disabled", false);
                        $('select').attr("disabled", false);
                        $("#telephone").blur(function () {
                            var phoneReg = /^(13[0-9]{9})|(15[0-9][0-9]{8})|(18[0-9][0-9]{8})$/;
                            var telephone = $("#telephone").val();
                            if (!phoneReg.test(telephone)) {
                                layui.use('layer', function () {
                                    var layer = layui.layer;
                                    layer.tips('手机号码需以13/15/18开头的11位数字!', '#telephone', {
                                        tips: [2, '#EB4549'],
                                        anim: 6
                                    });
                                });
                                flag = false;
                                $('select').attr("disabled", true);
                                $(this).focus(function () {
                                    $(this).val("");
                                });
                            } else {
                                flag = true;
                                $('select').attr("disabled", false);
                            }
                            console.log(flag);
                            return flag;
                        });
                    }
                    console.log(flag);
                    return flag;
                });
            }
            console.log(flag);
            return flag;
        });
    }

})();