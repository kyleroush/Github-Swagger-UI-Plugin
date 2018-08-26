/* initialise variables */
var inputFiles = document.querySelector('#files-json');
var addFilesBtn = document.querySelector('#add-files');

var inputRepos = document.querySelector('#repos-json');
var addReposBtn = document.querySelector('#add-repos');

/*  add event listeners to buttons */

addFilesBtn.addEventListener('click', saveFiles);
addReposBtn.addEventListener('click', saveRepos);

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
  chrome.storage.local.get(function (data) {
    if (data.files === undefined) {
      data.files = ["\\.json", "\\.yaml"]
    }
    if (data.repos === undefined) {
      data.repos = [".*"]
    }    
    inputFiles.innerText = JSON.stringify(data.files);
    inputRepos.innerText = JSON.stringify(data.repos);
  });
}

/* save the files */

function saveFiles() {
  var files = inputFiles.value;
  var map = JSON.parse(files);
  chrome.storage.local.set({files: map}, function () {
    alert("saved files")

  });

}

/* save the repos */

function saveRepos() {
  var repos = inputRepos.value;
  var map = JSON.parse(repos);
  chrome.storage.local.set({repos: map}, function () {
    alert("saved repos")

  });

}