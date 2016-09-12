
var submit = document.getElementsByName("submit");
var confirm = document.getElementById("confirm");
console.log($('confirm').contents());
/*console.log(submit);
firstInput = "";
secondInput = "";
alert($("#confirm").text());
$( "#submit" ).click(function() {
  alert( "Handler for .click() called." );
});*/
/*if(firstInput === secondInput) {
    console.log(firstInput + " " + secondInput);
    submit.disabled = false;
  }
  else {
    console.log(firstInput + " " + secondInput);
    alert("Confirmed password must be the same as password");
    submit.disabled = true;
  }*/
  $(document).ready(function () {

    $(document).ready(function() {

      document.getElementsByName("username")[0]
      .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
          document.getElementById("submit").click();
        }
      });

      document.getElementsByName("password")[0]
      .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
          document.getElementById("submit").click();
        }
      });

      document.getElementsByName("confirmPassword")[0]
      .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
          document.getElementById("submit").click();
        }
      });

    $("#cancel").click(function () {
      $('#login-header').append('<div class=\"container\">\r\n     \r\n\t<button class=\"btn btn-lg btn-warning\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"><\/span> Loading...<\/button>\r\n<\/div>');
      window.location = '/'
    });

    document.getElementById("inputConPwd").addEventListener("input", function() {
      var pwd = document.getElementById("inputUserPwd");
      var conpwd = document.getElementById("inputConPwd");
      if(pwd.value === conpwd.value) {
        pwd.style.backgroundColor = "lightgreen";
        conpwd.style.backgroundColor = "lightgreen";

        document.getElementById("inputUserPwd").addEventListener("input", function() {
          var pwd = document.getElementById("inputUserPwd");
          var conpwd = document.getElementById("inputConPwd");
          if(pwd.value != conpwd.value) {
            pwd.style.backgroundColor = "#F75D59";
            conpwd.style.backgroundColor = "#F75D59";
          }
          else if(pwd.value === "" || conpwd.value === "") {
            pwd.style.backgroundColor = "white";
            conpwd.style.backgroundColor = "white";
          }
          else {
            pwd.style.backgroundColor = "lightgreen";
            conpwd.style.backgroundColor = "lightgreen";
          }
        }, false);
        
      }
      else if(pwd.value === "" || conpwd.value === "") {
        pwd.style.backgroundColor = "white";
        conpwd.style.backgroundColor = "white";
      }
      else {
        pwd.style.backgroundColor = "#F75D59";
        conpwd.style.backgroundColor = "#F75D59";
      }
    }, false);



    $("#submit").click(function () {
      var userName = document.getElementsByName("username")[0].value;
      var firstInput = document.getElementsByName("password")[0].value;
      var secondInput = document.getElementsByName("confirmPassword")[0].value;

      var user = {username: userName, password: firstInput, confirmPassword: secondInput};


      if(firstInput != secondInput) {
        alert("Confirmed password must be the same as password")
        return;
      }
      if(userName === "" || firstInput === "" || userName.includes(' ') || firstInput.includes(' ')) {
        alert("Username and Password cannot contain spaces and cannot be blank");
        return;
      }
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(user),
        url: '/adduser',
        success: function (data) {
          if(data == false)
            alert("Username already exists!");
          else {
            $('#login-header').append('<div class=\"container\">\r\n     \r\n\t<button class=\"btn btn-lg btn-warning\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"><\/span> Loading...<\/button>\r\n<\/div>');
            window.location = '/'
          }
        }
      });
    });

  });
});
