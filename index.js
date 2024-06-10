async function handleRequest(evt) {
  evt.preventDefault();

  let value = input.value;

  let url = `https://api.github.com/search/repositories?q=${value}+in:name&sort=best-match&order=desc`;

  let response = await fetch(url);
  if (response.ok) {
    let json = await response.json();
    console.log(json);
    // console.log(json.items.map((el) => el.name.sort()));

    // console.log(json.items[0].name);
    // console.log(json.items[0].owner.login);
    // console.log(json.items[0].stargazers_count);
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
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

const form = document.getElementById("formElem");
const input = document.getElementById("autocomplete");

console.log(input);

input.addEventListener("input", debounce(handleRequest, 500));
