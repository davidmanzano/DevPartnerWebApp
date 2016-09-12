$(document).ready(function () {

  document.getElementsByName("Username")[0]
  .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      document.getElementById("loginButton").click();
    }
  });

  $(document).on('click', '#loginButton', function () {
    var user = {username: document.getElementsByName("Username")[0].value};
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(user),
      url: '/loginasadmin',
      success: function (data) {
        if (data == false || document.getElementsByName("Username")[0].value === "") {
          alert("User doesn't exist");
        }
        else {
          console.log(data);
          window.location = '/userlist';
        }
      }
    });
  });
  $(document).on('click', '#reRunButton', function () {
    NProgress.start();
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: '/reRunAll',
      success: function (data) {
        NProgress.done();
      }
    });
  });

});
