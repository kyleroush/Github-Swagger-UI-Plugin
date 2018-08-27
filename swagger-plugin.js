var filePatterns = ["\\.json", "\\.yaml"]
var repoPatterns = [".*"]

function initialize() {
    chrome.storage.local.get(function (data) {
        if (data.files === undefined) {
            data.files = JSON.stringify(filePatterns);
        }
        if (data.repos === undefined) {
            data.repos = JSON.stringify(repoPatterns);
        }
        filePatterns = data.files;
        repoPatterns = data.repos;
        loopAllFiles();
    });
}
function loopAllFiles() {
    if(!repoMatches()) {
        return;
    }

    var fileHeaders = document.querySelectorAll('.file-header');
    fileHeaders.forEach(function(header){
        var alreadyDone = header.querySelector('.pr-swagger-ui');

        setDataPath(header);

        if(alreadyDone === null && pathMatches(header)) {
            var actions = header.querySelector('.file-actions');
            actions.insertBefore(buildButtons(header), actions.firstChild);
        }
    });
}

function pathMatches(header) {
    var toReturn = false;

    filePatterns.forEach((pat) => {
        if(header.dataset.path.match(RegExp(pat)) !== null) {
            toReturn = true;
        }
    });

    return toReturn;
}

function repoMatches(header) {
    var toReturn = false;
    var repo = location.pathname.split('/').slice(0,3).join('/');
    repoPatterns.forEach((pat) => {
        if(repo.match(RegExp(pat)) !== null) {
            toReturn = true;
        }
    });

    return toReturn;
}

function buildButtons(header) {

    var diffButton = document.createElement("button");
    diffButton.innerText = "diff"
    diffButton.className = "diff-button BtnGroup-form BtnGroup-item selected btn btn-sm js-prose-diff-toggle-form"
    diffButton.onclick = function() {
        hideSwagger(header);
    };

    // btn btn-sm BtnGroup-item

    var swaggerButton = document.createElement("button");
    swaggerButton.innerText = "swagger"
    swaggerButton.className = "swagger-button BtnGroup-form BtnGroup-item btn btn-sm js-prose-diff-toggle-form"
    swaggerButton.onclick = function() {
        showSwagger(header);
    };;

    var maSpan = document.createElement("span");
    maSpan.appendChild(diffButton)
    maSpan.appendChild(swaggerButton)
    maSpan.className = "BtnGroup pr-swagger-ui"
    return maSpan;
}

function renderSwagger(header) {
    // Build a system
    const ui = SwaggerUIBundle({
    url: getPath(header),
    dom_id: '#'+getId(header.dataset.path),
    deepLinking: true,
    presets: [
        SwaggerUIBundle.presets.apis
    ],
    plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
    ]
    })

    window.ui = ui
}

function getPath(header) {
    var pathEl = header.querySelector('.file-actions').querySelector('#raw-url');

    if(pathEl === null) {
        var pathEl = header.querySelector('.file-actions').querySelector('.btn.btn-sm.tooltipped.tooltipped-nw');

    }
    var path = pathEl.attributes.href;
    var host = location.host;
    if (host === "github.com") {
        host = "githubusercontent.com";
    }

    return `https://raw.${host}${path.value.replace('/blob', '').replace('/raw', '')}`;
}

function hideSwagger(header) {
    var content = getContent(header.parentElement)
    content.querySelector('.data').classList.remove("hide")
    var swagger = content.querySelector('#'+getId(header.dataset.path));
    if(swagger !== null) {
        swagger.classList.add("hide")
    }
    header.querySelector('.diff-button').classList.add("selected")
    header.querySelector('.swagger-button').classList.remove("selected")
}

function showSwagger(header) {
    var content = getContent(header.parentElement)
    var swagger = content.querySelector('#'+getId(header.dataset.path));
    if(swagger === null) {
        var swagger = document.createElement("div");
        swagger.id = getId(header.dataset.path);
        content.appendChild(swagger);

        renderSwagger(header);
    } else {
        swagger.classList.remove("hide")
    }
    header.querySelector('.swagger-button').classList.add("selected")
    header.querySelector('.diff-button').classList.remove("selected")

    content.querySelector('.data').classList.add("hide");
}

function getId(path) {
    return 'swagger-' + path.split('.').join('-').split('/').join('-');
}

function setDataPath(header) {
    if (header.dataset.path === undefined) {

        header.dataset.path = '/' + location.pathname.split('/').slice(5).join('/')
    }
}

function getContent(file) {
    var content = file.querySelector('.js-file-content');
    if(content === null) {
        content = document.createElement('div');
        content.className = "js-file-content";
        var data = file.querySelector('.data');
        file.replaceChild(content, data)
        content.appendChild(data);
    }
    return content;
}
