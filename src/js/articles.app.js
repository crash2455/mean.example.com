//TODO: publication dates

var articlesApp = (function () {

  function viewArticles() {

    let uri = `${window.location.origin}/api/articles`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', uri);

    xhr.setRequestHeader(
      'Content-Type',
      'application/json; charset=UTF-8'
    );

    xhr.send();

    xhr.onload = function () {
      let app = document.getElementById('app');
      let data = JSON.parse(xhr.response);
      let articles = data.articles;
      let table = '';
      let rows = '';

      //Loop each user record into it's own HTML table row, each user should
      //have a link a user view
      for (let i = 0; i < articles.length; i++) {
        rows = rows + `<tr>
          <td>
            <a href="#view-${articles[i]['_id']}">${articles[i]['title']}</a>
          </td>
          <td>${articles[i]['description']}</td>
          <td>${articles[i]['published']}</td>
        </tr>`;
      }

      //Create a users panel, add a table to the panel, inject the rows into the
      //table
      table = `<div class="card">
        <div class="card-header clearfix">
          <h2 class="h3 float-left">Posts</h2>
          <div class="float-right">
            <a href="#create" class="btn btn-primary">New Post</a>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                <td>Title</td>
                <td>Description</td>
                <td>Date Published</td>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;

      //Append the HTML to the #app
      app.innerHTML = table;
    }
  }

  function createArticle() {
    var app = document.getElementById('app');

    var form = `
        <div class="card">
          <div class="card-header clearfix">
            <h2 class="h3 float-left">New Post</h2>
            <div class="float-right">
              <a href="#" class="btn btn-primary">Cancel</a>
            </div>
          </div>
          <div class="card-body">
            <form id="createArticle" class="card-body">
              <div id="formMsg" class="alert alert-danger text-center">Your form has errors</div>

              <div class="row">
                <div class="form-group col-md">
                  <label for="title">Title</label>
                  <input type="text" id="title" name="title" class="form-control" required>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md">
                  <label for="body">Body</label>
                  <textarea id="body" name="body" class="form-control" required></textarea>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="description">Summary</label>
                  <input type="text" id="description" name="description" class="form-control" required>
                </div>

                <div class="form-group col-md-6">
                  <label for="keywords">Keywords (separated by commas)</label>
                  <input type="text" id="keywords" name="keywords" class="form-control" required>
                </div>
              </div>

              <div class="text-right">
                <input type="submit" value="Submit" class="btn btn-lg btn-primary btn-sm-block">
              </div>
            </form>
          </div>
        </div>
    `;


    app.innerHTML = form;
  }

  function postRequest(formId, url) {
    let form = document.getElementById(formId);
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let formData = new FormData(form);
      let uri = `${window.location.origin}${url}`;
      let xhr = new XMLHttpRequest();
      xhr.open('POST', uri);

      xhr.setRequestHeader(
        'Content-Type',
        'application/json; charset=UTF-8'
      );

      let object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      xhr.send(JSON.stringify(object));
      xhr.onload = function () {
        let data = JSON.parse(xhr.response);
        if (data.success === true) {
          window.location.href = '/app/articles';
        } else {
          document.getElementById('formMsg').style.display = 'block';
        }
      }
    });
  }

  function editArticle(id) {

    let uri = `${window.location.origin}/api/articles/${id}`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', uri);

    xhr.setRequestHeader(
      'Content-Type',
      'application/json; charset=UTF-8'
    );

    xhr.send();

    xhr.onload = function () {
      let app = document.getElementById('app');
      let data = JSON.parse(xhr.response);

      var form = `
        <div class="card">
          <div class="card-header clearfix">
            <h2 class="h3 float-left">Edit Post</h2>
            <div class="float-right">
              <a href="#" class="btn btn-primary">Cancel</a>
            </div>
          </div>
          <div class="card-body">
            <form id="editArticle" class="card-body">
              <div id="formMsg" class="alert alert-danger text-center">Your form has errors</div>

              <div class="row">
                <div class="form-group col-md">
                  <label for="title">Title</label>
                  <input type="text" id="title" name="title" class="form-control" value="${data.article.title}" required>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md">
                  <label for="body">Body</label>
                  <textarea id="body" name="body" class="form-control" required>${data.article.body}</textarea>
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="description">Summary</label>
                  <input type="text" id="description" name="description" class="form-control" value="${data.article.description}" required>
                </div>

                <div class="form-group col-md-6">
                  <label for="keywords">Keywords (separated by commas)</label>
                  <input type="text" id="keywords" name="keywords" class="form-control" value="${data.article.keywords}" required>
                </div>
              </div>
              <div>
                <input type="hidden" id="_id" name="_id" class="form-control" value="${data.article._id}" required>
              </div>
              <div>
                <input type="hidden" id="created" name="created" class="form-control" value="${data.article.created}" required>
              </div>

              <div class="text-right">
                <input type="submit" value="Submit" class="btn btn-lg btn-primary btn-sm-block">
              </div>
            </form>
          </div>
        </div>
  `;

      app.innerHTML = form;
      processRequest('editArticle', '/api/articles', 'PUT');
    }
  }

  function processRequest(formId, url, method) {
    let form = document.getElementById(formId);
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let formData = new FormData(form);
      let uri = `${window.location.origin}${url}`;
      let xhr = new XMLHttpRequest();
      xhr.open(method, uri);

      xhr.setRequestHeader(
        'Content-Type',
        'application/json; charset=UTF-8'
      );

      let object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      xhr.send(JSON.stringify(object));
      xhr.onload = function () {
        let data = JSON.parse(xhr.response);
        if (data.success === true) {
          window.location.href = '/articles/app';
        } else {
          document.getElementById('formMsg').style.display = 'block';
        }
      }
    });
  }

  return {
    load: function () {
      let hash = window.location.hash;
      let hashArray = hash.split('-');

      switch (hashArray[0]) {
        case '#create':
          createArticle();
          postRequest('createArticle', '/api/articles');
          break;

        case '#view':
          editArticle(hashArray[1]);
          break;

        case '#edit':
          editArticle(hashArray[1]);
          break;

        case '#delete':
          console.log('DELETE');
          break;

        default:
          viewArticles();
          break;
      }
    }
  }
})()


articlesApp.load();

window.addEventListener("hashchange", function () {
  articlesApp.load();
})

