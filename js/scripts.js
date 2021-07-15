const gallery = document.querySelector(".gallery");
let employeeData = "";
//-------------------------------
// FETCH FUNCTIONS
//-------------------------------

//fetches 12 random users from the U.S.
fetch("https://randomuser.me/api/?results=12&nat=us")
  .then(checkStatus)
  .then((results) => results.json())
  .then(function (res) {
    employeeData = res.results;
  })
  .then(appendSearch)
  .finally(() => createCard(employeeData));

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    let errorHTML = `<h2 class="error">${response.statusText}. Please try again later.</h2>`;
    gallery.insertAdjacentHTML("beforeend", errorHTML);
    return Promise.reject(new Error(respose.statusText));
  }
}
//-------------------------------
// EMPLOYEE CARD FUNCTIONS
//-------------------------------
function createCard(employees) {
  for (let i = 0; i < employees.length; i++) {
    let person = employees[i];
    let newCard = `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
      </div>`;
    gallery.insertAdjacentHTML("beforeend", newCard);

    //click event listner for card to bring up modal
    let card = gallery.lastElementChild;
    card.addEventListener("click", (e) => findCard(e, employees));
  }
}

// What is a less clunky way to find the clicked card and match it to the
// data from the API than the way I do it below?
function findCard(event, employees) {
  //finds parent node of click event
  if (event.target.className === "card") {
    let parent = event.target;
  } else if (event.target.parentNode.className === "card") {
    parent = event.target.parentNode;
  } else if (event.target.parentNode.parentNode.className === "card") {
    parent = event.target.parentNode.parentNode;
  }
  //uses email to determine index in employeeData array
  let infoCard = parent.lastElementChild;
  let infoCardElements = infoCard.childNodes;
  let email = infoCardElements[3].textContent;
  let index = employees.findIndex((person) => person.email === email);
  //passes clicked index to modal
  createModal(index, employees);
}

//-------------------------------
// MODAL FUNCTIONS
//-------------------------------
function createModal(index, employees) {
  const current = employees[index];
  const loc = current.location;
  const birthday = formatBirthday(current.dob.date);
  const modal = `
    <div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${current.picture.large}" alt="profile picture">
              <h3 id="name" class="modal-name cap">${current.name.first} ${current.name.last}</h3>
              <p class="modal-text">${current.email}</p>
              <p class="modal-text cap">${loc.city}</p>
              <hr>
              <p class="modal-text">${current.phone}</p>
              <p class="modal-text">${loc.street.number} ${loc.street.name}, ${loc.city}, ${loc.state} ${loc.postcode}</p>
              <p class="modal-text">Birthday: ${birthday}</p>
          </div>
      </div>
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
  </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modal);

  //event listener for 'x' button to close modal
  const closebtn = document.querySelector(".modal-close-btn");
  closebtn.addEventListener("click", hideModal);

  //event listeners for toggle buttons
  const navigationButtons = document.querySelector(".modal-btn-container");
  navigationButtons.addEventListener("click", function (e) {
    if (e.target.type === "button") {
      navigate(e, index, employees);
    }
  });
}

//format birthday as MM/DD/YYYY
function formatBirthday(birthdayData) {
  const mm = birthdayData.slice(5, 7);
  const dd = birthdayData.slice(8, 10);
  const yyyy = birthdayData.slice(0, 4);
  birthday = `${mm}/${dd}/${yyyy}`;
  return birthday;
}
//close modal using the 'x'
function hideModal() {
  document.body.removeChild(document.body.lastElementChild);
}

//modal toggle to navigate between employees when modal is open
function navigate(e, index, employees) {
  hideModal();
  switch (e.target.textContent) {
    case "Prev":
      if (index == 0) {
        index = employees.length - 1;
      } else {
        index--;
      }
      break;
    case "Next":
      if (index == employees.length - 1) {
        index = 0;
      } else {
        index++;
      }
      break;
    default:
      hideModal();
  }
  createModal(index, employees);
}

//-------------------------------
// SEARCH TOOL FUNCTIONS
//-------------------------------
function appendSearch() {
  const searchTool = `
  <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
  `;
  const searchContainer = document.querySelector(".search-container");
  searchContainer.insertAdjacentHTML("beforeend", searchTool);

  searchContainer.addEventListener("input", searchFilter);
}

function searchFilter() {
  const searchText = document.querySelector(".search-input");
  const searchStringLower = searchText.value.toLowerCase();
  function filter(employeeData, searchStringLower) {
    return employeeData.filter(
      (el) => el.name.first.toLowerCase().indexOf(searchStringLower) !== -1
      // el.name.last.toLowerCase().indexOf(searchStringLower) !== -1
    );
  }
  const filteredEmployees = filter(employeeData, searchStringLower);

  gallery.innerHTML = "";
  createCard(filteredEmployees);
}
