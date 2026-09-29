// ============================================
// GOOGLE APPS SCRIPT URL
// ============================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbz_FnPEl1JG0QTA-t_fqYxr0MuSFv4JbqF5bd4tNNyl4g1CgwO0B6nqcFWoq_WBgc0T/exec";


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


        <div class="field">

          <label>
            MOBILE NUMBER
          </label>

          <input
            type="tel"
            class="victim-mobile"
            placeholder="10-digit mobile number"
            maxlength="10"
            inputmode="numeric"
          >

        </div>


        <div class="field">

          <label>
            EMAIL ID
          </label>

          <input
            type="email"
            class="victim-email"
            placeholder="your@email.com"
            maxlength="120"
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


  const mobiles =
    document.querySelectorAll(
      ".victim-mobile"
    );


  const emails =
    document.querySelectorAll(
      ".victim-email"
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
        registrations[i].value.trim(),

      mobile:
        mobiles[i].value.trim(),

      email:
        emails[i].value.trim()

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

    // NAME

    if (!victims[i].name) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS A NAME."
      );

      return false;

    }


    // REGISTRATION NUMBER

    if (!victims[i].regNo) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS A REGISTRATION NUMBER."
      );

      return false;

    }


    // MOBILE NUMBER

    if (!victims[i].mobile) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS A MOBILE NUMBER."
      );

      return false;

    }


    const mobile =
      victims[i].mobile.replace(
        /\D/g,
        ""
      );


    if (mobile.length !== 10) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS A VALID 10-DIGIT MOBILE NUMBER."
      );

      return false;

    }


    // EMAIL

    if (!victims[i].email) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS AN EMAIL ID."
      );

      return false;

    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        victims[i].email
      )
    ) {

      alert(
        "VICTIM " +
        (i + 1) +
        " NEEDS A VALID EMAIL ID."
      );

      return false;

    }

  }


  // DISASTER

  if (!disaster.value.trim()) {

    alert(
      "YOU HAVEN'T CREATED A DISASTER YET."
    );

    return false;

  }


  // FATE

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
