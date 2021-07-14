const gallery = document.querySelector(".gallery");

//-------------------------------
// FETCH FUNCTIONS
//-------------------------------

//fetches 12 random users from the U.S.
fetch("https://randomuser.me/api/?results=12&nat=us")
  .then(checkStatus)
  .then((results) => results.json())
  .then((data) => createCard(data.results));

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(respose.statusText));
  }
}
//-------------------------------
// EMPLOYEE CARD FUNCTIONS
//-------------------------------
function createCard(data) {
  for (let i = 0; i < data.length; i++) {
    let person = data[i];
    let newCard = `<div class="card" id="${i}">
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
    let card = gallery.lastElementChild;
    card.addEventListener("click", (e) => findCard(e, data));
  }
}

function findCard(event, data) {
  if (event.target.className === "card") {
    let index = event.target.id;
  } else if (event.target.parentNode.className === "card") {
    index = event.target.parentNode.id;
  } else if (event.target.parentNode.parentNode.className === "card") {
    index = event.target.parentNode.parentNode.id;
  }
  createModal(data, index);
}

//-------------------------------
// MODAL FUNCTIONS
//-------------------------------
function createModal(data, index) {
  let current = data[index];
  let loc = current.location;
  let modal = `
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
              <p class="modal-text">Birthday: ${current.dob.date}</p>
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
  let closebtn = document.querySelector(".modal-close-btn");
  closebtn.addEventListener("click", hideModal);

  //event listeners for toggle buttons
  let navigationButtons = document.querySelector(".modal-btn-container");
  navigationButtons.addEventListener("click", (e) => navigate(e, data, index));
}

//close modal using the 'x'
function hideModal() {
  document.body.removeChild(document.body.lastElementChild);
}

//modal toggle to navigate between employees when modal is open
function navigate(e, data, index) {
  hideModal();
  switch (e.target.textContent) {
    case "Prev":
      if (index == 0) {
        index = data.length - 1;
      } else {
        index--;
      }
      break;
    case "Next":
      if (index == data.length - 1) {
        index = 0;
      } else {
        index++;
      }
      break;
    default:
      hideModal();
  }
  createModal(data, index);
}
//-------------------------------
// SEARCH TOOL FUNCTIONS
//-------------------------------
