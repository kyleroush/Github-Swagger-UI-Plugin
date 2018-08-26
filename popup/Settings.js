/* initialise variables */
var inputBody = document.querySelector('#files-json');
var addBtn = document.querySelector('.add');

/*  add event listeners to buttons */

addBtn.addEventListener('click', save);

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
  chrome.storage.local.get(function (data) {
    if (data.files === undefined) {
      data.files = ["\\.json", "\\.yaml"]
    }
    inputBody.innerText = JSON.stringify(data["files"]);
  });
}

/* save the files */

function save() {
  var files = inputBody.value;
  var map = JSON.parse(files);
  chrome.storage.local.set({files: map}, function () {
    alert("saved")

  });

}