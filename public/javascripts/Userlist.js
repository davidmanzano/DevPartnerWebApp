var fileContents;
var fakeData = [["name one", "In Queue"], ["name two", "Ready"], ["name three", "Ready"]];
var userData = [];
var uploading = false;
var statusChanged = false;

$(document).ready(function () {

    // show user settings
    $("#settingsButton").click(function () {
        // show Modal
        $('#myModal').modal('show');
    });

    // send ajax to delete user
    $("#deleteUser").click(function () {
        $.ajax({
            type: 'POST',
            url: '/deleteUser',
            contentType: 'application/json',
            success: function (data) {
                // return to homepage after deleting user
                window.location = '/'
            }
        });
    });

    $("#confirmchangepw").click(function () {
        var oldPass = document.getElementsByName("oldpassword")[0].value;
        var newPass = document.getElementsByName("newpassword")[0].value;
        var newPassConf = document.getElementsByName("confirmPassword")[0].value;

        // check if new password is valid
        if (newPass != newPassConf) {
            alert("Confirmed password must be the same as password")
            return;
        }
        if (newPass === "" || newPass.includes(' ')) {
            alert("Password cannot contain spaces and cannot be blank");
            return;
        }

        var pass = { old: oldPass, password: newPass };

        //send ajax to change password
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(pass),
            url: '/changePassword',
            success: function (data) {
                if (data == false) // returned false because old password didn't match
                    alert("Old Password Incorrect!");
                else { // reset password fields/input after sucessful change

                    alert("Successfully changed Password!!");
                    $("#inputOldUserPwd").val("");
                    $("#inputUserPwd").val("");
                    $("#inputConPwd").val("");
                    var pwd = document.getElementById("inputUserPwd");
                    var conpwd = document.getElementById("inputConPwd");
                    pwd.style.backgroundColor = "white";
                    conpwd.style.backgroundColor = "white";
                }
            }
        });
    });

    // add listener to input fields to confirm whether new passwords are same
    document.getElementById("inputConPwd").addEventListener("input", function () {
        var pwd = document.getElementById("inputUserPwd");
        var conpwd = document.getElementById("inputConPwd");
        if (pwd.value === conpwd.value) {
            pwd.style.backgroundColor = "lightgreen";
            conpwd.style.backgroundColor = "lightgreen";

            document.getElementById("inputUserPwd").addEventListener("input", function () {
                var pwd = document.getElementById("inputUserPwd");
                var conpwd = document.getElementById("inputConPwd");
                if (pwd.value != conpwd.value) {
                    pwd.style.backgroundColor = "#F75D59";
                    conpwd.style.backgroundColor = "#F75D59";
                }
                else if (pwd.value === "" || conpwd.value === "") {
                    pwd.style.backgroundColor = "white";
                    conpwd.style.backgroundColor = "white";
                }
                else {
                    pwd.style.backgroundColor = "lightgreen";
                    conpwd.style.backgroundColor = "lightgreen";
                }
            }, false);

        }
        else if (pwd.value === "" || conpwd.value === "") {
            pwd.style.backgroundColor = "white";
            conpwd.style.backgroundColor = "white";
        }
        else {
            pwd.style.backgroundColor = "#F75D59";
            conpwd.style.backgroundColor = "#F75D59";
        }
    }, false);

    // Constant pulling from the database to determine if status has changed
    // /backCheck is called first to determine whether user pressed back button or not to get to page
  $.ajax({
      type: 'POST',
      url: '/backCheck',
      contentType: 'application/json',
      success: function (data) {
          if (data == true)
          {
              $.ajax({
                  type: 'POST',
                  url: '/sendUserDataInfo',
                  contentType: 'application/json',
                  success: function (data) {
                      for (i = 0; i < data.length; i++) {
                          data[i].date = new Date(data[i].date).toLocaleString();
                          userData.push(data[i]);
                      }
                      generateTable();
                  }
              });

              setInterval(function () {
                  $.ajax({
                      type: 'POST',
                      url: '/sendUserDataInfo',
                      contentType: 'application/json',
                      success: function (data) {
                          statusChanged = false;

                          // loop through all statuses to see if one changed
                          if (userData.length == data.length) {
                              for (var i = 0; i < data.length; i++) {
                                  if (userData[i].status != data[i].status) {
                                      statusChanged = true;
                                      break;
                                  }
                              }
                          }

                          // update status if length changed (new file uploaded) or status changed
                          if ((userData.length != data.length && !uploading) || statusChanged) {
                              userData = [];
                              for (i = 0; i < data.length; i++) {
                                  data[i].date = new Date(data[i].date).toLocaleString();
                                  userData.push(data[i]);
                              }
                              generateTable();
                          }
                      }
                  });
              }, 1000);
          }
          else // if backcheck was false, then return to homepage
          {
              window.location = "/";
          }
      }
      });


});

// fucntion called when upload button pressed
function uploadPress() {
    uploading = true;

    NProgress.start();
    document.getElementById("upload").disabled = true;
    var sep = ",";
    var fileContentArray;

    // call external libary to convert csv to array
    fileContentArray = $.csv.toArrays(fileContents, {
        separator: sep
    });

    // create data to enter into table
    var thisdata = {};
    var thisdate = new Date(); 
    thisdata.name = document.getElementById("fileName").value;
    thisdata.status = "Uploading"
    thisdata.unprocessedData = JSON.stringify(fileContentArray);
    thisdata.date = thisdate.toLocaleString(); // convery GMT time to local

    userData.push(thisdata);
    generateTable();

    thisdata.date = thisdate.toUTCString();// use GMT data to enter into database

    // upload data's data to the database
    setTimeout(function () {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(thisdata),
            contentType: 'application/json',
            url: '/uploaduserdata',
            success: function (data) {
                thisdata.id = data;
                uploading = false;
            }
        });
    }, 10);

}
// fucntion when user deletes a dataset
function closeButtonPress(index) {
    NProgress.start();
    $.ajax({
        type: 'POST',
        data: JSON.stringify({i: index}),
        contentType: 'application/json',
        url: '/deleteUserDataSet',
        success: function (data) {
            NProgress.inc();
            userData.splice(index, 1);
            generateTable();
        }
    });

}
// fucntion when user clicks on a dataset
function linkToPage(index) {
    if (userData[index].status == "Ready") {
        //send id of processed data + name to display on next pag
        var dataObj = {};
        dataObj.id = index;
        dataObj.name = userData[index].name;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(dataObj),
            contentType: 'application/json',
            url: '/saveDataIndex',
            success: function (data) {
                window.location = '/CSVApp'
            }
        });
    }
    else {
        alert("Not Ready");
    }
}

// after file has been picked
function filePicked(event) {
    var file = event.target.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        document.getElementById("fileName").value = file.name;
        fileContents = event.target.result;

        document.getElementById("upload").disabled = false;
    };
    if(file != undefined) {
      fileReader.readAsText(file);
    }

}

// regenerates table with userData array
function generateTable() {
      NProgress.start();

    var datasLength = userData.length;

    var table = document.getElementById("dataTableBody");
    if (table != null)
    {
        table.innerHTML = "";

        for (i = 0; i < datasLength ; i++) {
              NProgress.inc();

            // populate table with cells and appropriate data
            var row = table.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = userData[i].date;
            cell2.innerHTML = '<a onclick="linkToPage(' + i + ');return false;">' + userData[i].name + '</a>';
            cell3.innerHTML = userData[i].status;

            // allow removal if done processing
            if(userData[i].status == 'Ready') {
              cell4.innerHTML = '<button type="button" class="btn btn-default" onclick="closeButtonPress(' + i + ')">X</button>';
            }

            // set color of status
            if(userData[i].status == "In Queue")
            {
              cell3.style.fontWeight = 'bold';
              cell3.style.color = 'cadetblue';
            }
            if(userData[i].status == "Error")
            {
              cell3.style.fontWeight = 'bold';
              cell3.style.color = 'red';
            }
            if(userData[i].status == "Uploading")
            {
              cell3.style.fontWeight = 'bold';
              cell3.style.color = 'gold';
            }
            if(userData[i].status == "Downloading")
            {
              cell3.style.fontWeight = 'bold';
              cell3.style.color = 'gold';
            }
            if(userData[i].status == "Ready")
            {
              cell3.style.fontWeight = 'bold';
              cell3.style.color = 'limegreen';
            }
            if(userData[i].status == "Processing")
            {
              cell3.style.fontWeight = 'bold';
              cell3.style.color = 'orange';
            }

        }
    }
      NProgress.done();


}
