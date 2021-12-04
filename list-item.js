for (var i = 0; i < items.length; i++) {
  // format repo name
  var itemName = items[i].owner.login + "/" + repos[i].name;

  // create a container for each repo
  var repoEl = document.createElement("a");
  repoEl.classList = "list-item flex-row justify-space-between align-center";
  repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

  // create a span element to hold repository name
  var titleEl = document.createElement("span");
  titleEl.textContent = repoName;

  // append to container
  repoEl.appendChild(titleEl);

  // create a status element
  var statusEl = document.createElement("span");
  statusEl.classList = "flex-row align-center";

  // check if current repo has issues or not
  if (repos[i].open_issues_count > 0) {
    statusEl.innerHTML =
      "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
  } else {
    statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
  }

  // append to container
  repoEl.appendChild(statusEl);

  // append container to the dom
  repoContainerEl.appendChild(repoEl);