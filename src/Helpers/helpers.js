export function isEmpty(input) {
  return input.trim().length === 0;
}

export function validateAll(inputsObj) {
  let inputsValidated;
  for (let input in inputsObj) {
    if (inputsObj[input].value != "" && inputsObj[input].value > 0) {
      inputsValidated = true;
      break;
    } else {
      inputsValidated = false;
    }
  }
  return inputsValidated;
}

export function areYouSure(yes) {
  let action;

  var body = document.getElementById('sapper');

  var backDrop = document.createElement("div");
  backDrop.classList.add("modal-backdrop-aus");
 


  var cardDiv = document.createElement("div");
  cardDiv.classList.add("cardAreYouSure");

  var question = document.createTextNode("Esta Seguro?");
  cardDiv.appendChild(question);

  var buttons = document.createElement("div");
  buttons.classList.add("buttons-aus");
  cardDiv.appendChild(buttons);
  var buttonCancel = document.createElement("button");
  buttonCancel.textContent='Cancel';
  buttonCancel.classList.add("waves-effect", "waves-light", "btn");
  var buttonYes = document.createElement("button");
  buttonYes.textContent='Si';

  buttonYes.classList.add("waves-effect", "waves-light", "btn");
  buttons.append(buttonCancel, buttonYes);

  body.append(cardDiv, backDrop);

  function close() {
    backDrop.remove();
    cardDiv.remove();
  }

  function yesAnswer() {
    action = yes();
    close();
  }

  backDrop.addEventListener("click", close);
  buttonCancel.addEventListener("click", close);
  buttonYes.addEventListener("click", yesAnswer);

  return action;
}
