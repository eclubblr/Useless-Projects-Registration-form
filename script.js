// ============================================
// GOOGLE APPS SCRIPT URL
// ============================================

const API_URL =
  "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";


// ============================================
// ELEMENTS
// ============================================

const form =
  document.getElementById(
    "uselessForm"
  );

const victimsContainer =
  document.getElementById(
    "victimsContainer"
  );

const addVictimButton =
  document.getElementById(
    "addVictim"
  );

const disaster =
  document.getElementById(
    "disaster"
  );

const characterCount =
  document.getElementById(
    "characterCount"
  );

const success =
  document.getElementById(
    "success"
  );

const submissionId =
  document.getElementById(
    "submissionId"
  );

const submitButton =
  document.getElementById(
    "submitButton"
  );


// ============================================
// VICTIM COUNT
// ============================================

let victimCount = 1;


// ============================================
// ADD VICTIM
// ============================================

addVictimButton.addEventListener(
  "click",
  function () {

    if (victimCount >= 3) {

      alert(
        "THREE HUMANS IS ENOUGH."
      );

      return;

    }


    victimCount++;


    const victim =
      document.createElement("div");


    victim.className =
      "victim";


    victim.innerHTML = `

      <div class="victim-top">

        <span>
          VICTIM 0${victimCount}
        </span>

        <span>
          REQUIRED
        </span>

      </div>


      <div class="victim-fields">

        <div class="field">

          <label>
            NAME
          </label>

          <input
            type="text"
            class="victim-name"
            placeholder="Who are you?"
            maxlength="80"
          >

        </div>


        <div class="field">

          <label>
            REGISTRATION NO.
          </label>

          <input
            type="text"
            class="victim-reg"
            placeholder="Official identification"
            maxlength="30"
          >

        </div>

      </div>

    `;


    victimsContainer.appendChild(
      victim
    );


    if (victimCount >= 3) {

      addVictimButton.style.display =
        "none";

    }

  }
);


// ============================================
// CHARACTER COUNT
// ============================================

disaster.addEventListener(
  "input",
  function () {

    characterCount.textContent =
      this.value.length +
      " / 1500";

  }
);


// ============================================
// COLLECT VICTIMS
// ============================================

function collectVictims() {

  const names =
    document.querySelectorAll(
      ".victim-name"
    );


  const registrations =
    document.querySelectorAll(
      ".victim-reg"
    );


  const victims = [];


  for (
    let i = 0;
    i < names.length;
    i++
  ) {

    victims.push({

      name:
        names[i].value.trim(),

      regNo:
        registrations[i].value.trim()

    });

  }


  return victims;

}


// ============================================
// VALIDATE
// ============================================

function validateForm() {

  const syndicate =
    document
      .getElementById(
        "syndicateName"
      )
      .value
      .trim();


  if (!syndicate) {

    alert(
      "NAME YOUR SILLY SYNDICATE FIRST."
    );

    return false;

  }


  const victims =
    collectVictims();


  for (
    let i = 0;
    i < victims.length;
    i++
  ) {

    if (!victims[i].name) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS A NAME."
      );

      return false;

    }


    if (!victims[i].regNo) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS A REGISTRATION NUMBER."
      );

      return false;

    }

  }


  if (!disaster.value.trim()) {

    alert(
      "YOU HAVEN'T CREATED A DISASTER YET."
    );

    return false;

  }


  const fate =
    document
      .getElementById(
        "fateAccepted"
      )
      .checked;


  if (!fate) {

    alert(
      "YOU MUST ACCEPT YOUR FATE."
    );

    return false;

  }


  return true;

}


// ============================================
// SUBMIT
// ============================================

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    if (!validateForm()) {
      return;
    }


    const payload = {

      syndicateName:
        document
          .getElementById(
            "syndicateName"
          )
          .value
          .trim(),

      victims:
        collectVictims(),

      disaster:
        disaster.value.trim(),

      fateAccepted:
        true

    };


    submitButton.disabled =
      true;


    submitButton.textContent =
      "RECORDING YOUR POOR DECISION...";


    try {

      /*
       * URLSearchParams keeps this request
       * simple and avoids unnecessary CORS
       * preflight requests.
       */

      const body =
        new URLSearchParams();


      body.append(
        "payload",
        JSON.stringify(payload)
      );


      const response =
        await fetch(
          API_URL,
          {

            method: "POST",

            body: body

          }
        );


      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          result.message ||
          "Submission failed."
        );

      }


      showSuccess(
        result.submissionId
      );


    } catch (error) {

      console.error(error);


      alert(
        "THE USELESS MACHINE BROKE.\n\n" +
        error.message
      );


      submitButton.disabled =
        false;


      submitButton.textContent =
        "SUBMIT THIS POINTLESS DECISION";

    }

  }
);


// ============================================
// SUCCESS
// ============================================

function showSuccess(id) {

  form.style.display =
    "none";


  success.classList.add(
    "show"
  );


  submissionId.textContent =
    id;


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}
