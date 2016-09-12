

var loading = '<div class="mdl-spinner mdl-js-spinner is-active"></div>'

$(document).ready(function() {

  /*Enter press event listener for username input field*/
  document.getElementsByName("username")[0]
  .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      document.getElementById("submit").click();
    }
  });

  /*Enter press event listener for password input field*/
  document.getElementsByName("password")[0]
  .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      document.getElementById("submit").click();
    }
  });

  /*Create Account button handler*/
  $(document).on('click', '#createAccount', function() {
    $('#login-header').append('<div class=\"container\">\r\n     \r\n\t<button class=\"btn btn-lg btn-warning\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"><\/span> Loading...<\/button>\r\n<\/div>');
    window.location = '/newuser'
  });

  /*Login button handler*/
  $(document).on('click', '#submit', function() {
    var firstInput = document.getElementsByName("username")[0].value;
    var secondInput = document.getElementsByName("password")[0].value;
    var user = {username: firstInput, password: secondInput};
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(user),
      url: '/login',
      success: function (data) {
          if (data.switch == false) {
              alert("Incorrect Username or Password");
          }
          else {
              $('#login-header').append('<div class=\"container\">\r\n     \r\n\t<button class=\"btn btn-lg btn-warning\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"><\/span> Loading...<\/button>\r\n<\/div>');
              window.location = data.destination;
          }
      }
    });
  });
});
