/**
 * Created by slshome on 02.08.14.
 */
var lang;
var socket;
var sKey;
var encrypt;
var decrypt;
var defLang = 'ru';

$(function() {
    lang = defLang;
    encrypt = new JSEncrypt();
    decrypt = new JSEncrypt();
    socket = io.connect('http://localhost:3000');
    socket.on('connect', function (data) {
//            console.log(socket.io.engine.id);
            socket.on('otvCheckLoginName', function(data) {
                if (data.exist) {
                    $( "#checkLoginColor" ).removeClass("has-success").addClass("has-error");
                    $( "#btnRegSend" ).addClass("disabled");
                } else {
                    $( "#checkLoginColor" ).removeClass("has-error").addClass("has-success");
                    $( "#btnRegSend" ).removeClass("disabled");
                }
            });
            socket.on('userAdded', function(data) {
                $('#modal-container-regged').modal('show');
            });
            socket.on('sendKey', function(data) {
                sKey = JSON.parse(Encode(data, socket.io.engine.id));
                encrypt.setPublicKey(sKey.pub);

            });
            socket.on('createSession', function(data) {
                console.log('createSession');
                $('#modal-container-login').modal('hide');
                sessionStorage.setItem('session', JSON.stringify(data));
                // sessionStorage.getItem('session');
                location="http://herogsold.sls/cabinet.html";
            });
            socket.on('loginError', function(data) {
// ToDo сделать нормальный мультиязычный вывод сообщения
                alert("Неправильный логин или пароль");
            });

   });
   loadIndex();
});

function loadAbout() {
    var login = new EJS({url: 'tpl/index/about.ejs'}).render();
    $( "#about" ).html(login);
}

function loadNews() {
    var login = new EJS({url: 'tpl/index/news.ejs'}).render();
    $( "#panelNews" ).html(login);
}

function loadPodval(data) {
    var login = new EJS({url: 'tpl/index/podval.ejs'}).render(data);
    $( "#podval" ).html(login);
}

function loadIndex(lg) {
    if (lg != null) {
    localStorage.lang = lg;
    }
    var lng = localStorage.lang;
    if (lng != null) {
    lang = lng;
    }
    if (lng == null) {
    lng = defLang;
    localStorage.lang = lng;
    }
    var path = "js/lang/" + lng + ".js";
    var pathVal = "js/jquery.validationEngine-" + lng + ".js";
    var google_path = "google_" + lng + ".html";
    $.getScript(path, function() {
        $.getScript(pathVal, function() {$("#registerForm").validationEngine();});

        $( "#index" ).html(new EJS({url: 'tpl/index/index.ejs'}).render());

        $( '#lang_sel_en' ).bind('click' , function(){
//            console.log('en');
            loadIndex('en');
        });
        $( '#lang_sel_ru' ).on('click', function(){
//            console.log('ru');
            loadIndex('ru');
        });
        loadPodval();
        $( '#btnLoginSend' ).on('click', function(){
            login();
        });
        $( '#btnRegSend' ).on('click', function(){
            sendRegForm();
        });
    });



}

function checkLoginName() {
    socket.emit('checkLoginName', JSON.stringify(encrypt.encrypt($( "#inputLogin").val())));
}

function checkPassword() {
    {
        if ($("#inputPassword3").val() != $("#inputPassword4").val()) {
            $( "#checkLoginPassword4" ).removeClass("has-success").addClass("has-error");
            $( "#btnRegSend" ).addClass("disabled");
        } else {
            $( "#checkLoginColor" ).removeClass("has-error").addClass("has-success");
            $( "#btnRegSend" ).removeClass("disabled");
        }
    }
}

function login() {
    var loginData={};
    loginData.login = encrypt.encrypt($("#inputLoginEnter").val());
    loginData.password = encrypt.encrypt($("#inputPasswordEnter").val());
    var validate = 1; //validator.matches(loginData.login, /^[0-9A-Za-zА-Яа-яЁё\s!@#$()+.=]+$/) * validator.matches(loginData.password, /^[0-9A-Za-zА-Яа-яЁё\s!@#$()+.=_]+$/);
    if(validate) {
        socket.emit('login', loginData);
    }

}

function sendRegForm() {
    var regData={};
    regData.login=$("#inputLogin").val();
    regData.password=$("#inputPassword3").val();
    regData.email=$("#inputEmail3").val();
    regData.realName=$("#inputRealName").val();
    regData.birthDay=$("#inputBirthDay").val();
    regData.sex=$("#index_sex").val();
    regData.lang=$("#index_lang").val();

    var validate = validator.matches(regData.login, /^[0-9A-Za-zА-Яа-яЁё\s!@#$()+.=]+$/) *
            validator.matches(regData.password, /^[0-9A-Za-zА-Яа-яЁё\s!@#$()+.=_]+$/) *
            validator.isEmail(regData.email) *
            validator.matches(regData.realName, /^[0-9A-Za-zА-Яа-яЁё\s]+$/) *
            validator.isDate(regData.birthDay);
    if (regData.sex == "sexMan") regData.sex = 1;
    if (regData.sex == "sexWoman") regData.sex = 0;
    if (regData.lang == "langRu") regData.lang = 0;
    if (regData.lang == "langEn") regData.lang = 1;

    if(validate) {
        socket.emit('regUser', regData );
    }
}





