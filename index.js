const form = document.getElementById("formElem");
const input = document.getElementById("autocomplete");
const menuRepositories = document.querySelector(".menu-repositories");
const menuRepositoriesItem = document.querySelectorAll(
  ".menu-repositories__item"
);

let json;

input.addEventListener("input", debounce(handleRequest, 500));
menuRepositories.addEventListener("click", addRepositories);

async function handleRequest(evt) {
  evt.preventDefault();

  let value = input.value;

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
    menuRepositoriesItem.forEach((el) => (el.textContent = ""));
    menuRepositories.style.opacity = 0;
    menuRepositories.style.visibility = "hidden";
  }
}

function setListContent(json) {
  const len = json.items.length;
  menuRepositoriesItem.forEach((el, i) => {
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
    let index = [...menuRepositories.children].indexOf(evt.target);
    console.log(index);
    console.log(json.items[index].name);
    console.log(json.items[index].owner.login);
    console.log(json.items[index].stargazers_count);
  }
}
