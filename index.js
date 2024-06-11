const form = document.getElementById("formElem");
const input = document.getElementById("autocomplete");
const menuRepositories = document.querySelector(".menu-repositories");
const menuRepositoriesItems = document.querySelectorAll(
  ".menu-repositories__item"
);
const listAddedRepositories = document.querySelector(
  ".list-added-repositories"
);

let json, value;

// const listAddedRepositoriesItem = listAddedRepositories.firstElementChild;
// const listInfo = listAddedRepositoriesItem.firstElementChild;
// const listInfoItems = listInfo.children;

input.addEventListener("input", debounce(handleRequest, 400));
menuRepositories.addEventListener("click", addRepositories);

async function handleRequest(evt) {
  evt.preventDefault();

  value = input.value;

  if (value.charCodeAt() !== 32 && value !== "") {
    let url = `https://api.github.com/search/repositories?q=${value}+in:name&sort=best-match&order=desc`;
    let response = await fetch(url);

    if (response.ok) {
      json = await response.json();
      // console.log(json);

      setListContent(json);

      menuRepositories.style.opacity = 1;
      menuRepositories.style.visibility = "visible";
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  } else if (value === "") {
    menuRepositoriesItems.forEach((el) => (el.textContent = ""));
    menuRepositories.style.opacity = 0;
    menuRepositories.style.visibility = "hidden";
  }
}

function setListContent(json) {
  const len = json.items.length;
  menuRepositoriesItems.forEach((el, i) => {
    if (len >= 5) {
      el.textContent =
        json.items[i].name[0].toUpperCase() + json.items[i].name.slice(1);
      el.dataset.show = "visible";
    } else if (len < 5 && len !== 0) {
      if (i >= len) {
        el.textContent = "";
        el.dataset.show = "hidden";
      } else {
        el.textContent =
          json.items[i].name[0].toUpperCase() + json.items[i].name.slice(1);
      }
    } else if (len === 0) {
      if (i === 0) {
        el.textContent = "The repository with this name does not exist";
        el.dataset.show = "visible";
      } else {
        el.textContent = "";
        el.dataset.show = "hidden";
      }
    }
  });
}

function debounce(fn, debounceTime) {
  let timerId;

  return function wrapper() {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => fn.apply(this, arguments), debounceTime);
  };
}

function addRepositories(evt) {
  if (evt.target.tagName === "LI") {
    input.value = "";
    let index = [...menuRepositories.children].indexOf(evt.target);
    listAddedRepositories.style.opacity = 1;
    listAddedRepositories.style.visibility = "visible";

    listAddedRepositories.insertAdjacentHTML(
      "beforeend",
      `<li class="list-added-repositories__item">
          <ul class="list-added-repositories__list-info list-info">
            <li class="list-info__name">Name: ${json.items[index].name}</li>
            <li class="list-info__owner">Owner: ${json.items[index].owner.login}</li>
            <li class="list-info__stars">Stars: ${json.items[index].stargazers_count}</li>       
            <div class="btn__cross">
              <div class="btn__cross-line btn__cross-line_horizontal"></div>
              <div class="btn__cross-line btn__cross-line_vertical">
                </div>
            </div>
          </ul>
        </li>`
    );
  }
}
