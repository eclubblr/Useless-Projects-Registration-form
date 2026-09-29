/****************************************************
 * USELESS PROJECTS — FRONTEND
 ****************************************************/


/*
 * IMPORTANT
 *
 * Replace this URL with your deployed
 * Google Apps Script Web App URL.
 */

const API_URL =
  "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";


/* =========================================
   STATE
========================================= */

let currentStep = 1;

const totalSteps = 4;

let victimCount = 1;


/* =========================================
   ELEMENTS
========================================= */

const form =
  document.getElementById("uselessForm");

const steps =
  document.querySelectorAll(".step");

const progressFill =
  document.getElementById("progressFill");

const stepCounter =
  document.getElementById("stepCounter");

const progressText =
  document.getElementById("progressText");

const victimsContainer =
  document.getElementById("victimsContainer");

const addVictimButton =
  document.getElementById("addVictimButton");

const successScreen =
  document.getElementById("successScreen");

const submissionId =
  document.getElementById("submissionId");

const submitButton =
  document.getElementById("submitButton");


/* =========================================
   STEP LABELS
========================================= */

const stepLabels = [

  "BEGIN THE NONSENSE",

  "ASSEMBLE THE VICTIMS",

  "CREATE THE DISASTER",

  "ACCEPT THE CONSEQUENCES"

];


/* =========================================
   UPDATE STEP
========================================= */

function updateStep() {

  steps.forEach(step => {

    const number =
      Number(step.dataset.step);

    step.classList.toggle(
      "active",
      number === currentStep
    );

  });


  const progress =
    (currentStep / totalSteps) * 100;


  progressFill.style.width =
    progress + "%";


  stepCounter.textContent =
    "STEP 0" +
    currentStep +
    " / 04";


  progressText.textContent =
    stepLabels[currentStep - 1];


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =========================================
   NEXT STEP
========================================= */

function nextStep() {

  if (!validateCurrentStep()) {
    return;
  }


  if (currentStep < totalSteps) {

    currentStep++;

    updateStep();

  }

}


/* =========================================
   PREVIOUS STEP
========================================= */

function previousStep() {

  if (currentStep > 1) {

    currentStep--;

    updateStep();

  }

}


/* =========================================
   VALIDATION
========================================= */

function validateCurrentStep() {

  /* STEP 1 */

  if (currentStep === 1) {

    const name =
      document
        .getElementById("syndicateName")
        .value
        .trim();


    if (!name) {

      showError(
        "Your silly syndicate needs a name."
      );

      return false;

    }

  }


  /* STEP 2 */

  if (currentStep === 2) {

    const names =
      document.querySelectorAll(
        ".victim-name"
      );

    const regs =
      document.querySelectorAll(
        ".victim-reg"
      );


    for (let i = 0; i < names.length; i++) {

      if (!names[i].value.trim()) {

        showError(
          "Victim " +
          (i + 1) +
          " needs a name."
        );

        names[i].focus();

        return false;

      }


      if (!regs[i].value.trim()) {

        showError(
          "Victim " +
          (i + 1) +
          " needs a registration number."
        );

        regs[i].focus();

        return false;

      }

    }

  }


  /* STEP 3 */

  if (currentStep === 3) {

    const disaster =
      document
        .getElementById("disaster")
        .value
        .trim();


    if (!disaster) {

      showError(
        "You haven't described your disaster yet."
      );

      return false;

    }

  }


  return true;

}


/* =========================================
   ADD VICTIM
========================================= */

function addVictim() {

  if (victimCount >= 3) {

    showError(
      "Three victims is enough. We are not monsters."
    );

    return;

  }


  victimCount++;


  const card =
    document.createElement("div");


  card.className =
    "victim-card";


  card.innerHTML = `

    <div class="victim-header">

      <span>
        VICTIM 0${victimCount}
      </span>

    </div>


    <div class="victim-inputs">

      <div>

        <label>
          NAME
        </label>

        <input
          type="text"
          class="victim-name"
          placeholder="Their unfortunate name"
          maxlength="80"
        >

      </div>


      <div>

        <label>
          REGISTRATION NO.
        </label>

        <input
          type="text"
          class="victim-reg"
          placeholder="Their official identity"
          maxlength="30"
        >

      </div>

    </div>

  `;


  victimsContainer.appendChild(card);


  if (victimCount >= 3) {

    addVictimButton.style.display =
      "none";

  }

}


/* =========================================
   COLLECT VICTIMS
========================================= */

function collectVictims() {

  const names =
    document.querySelectorAll(
      ".victim-name"
    );

  const regs =
    document.querySelectorAll(
      ".victim-reg"
    );


  const victims = [];


  for (let i = 0; i < names.length; i++) {

    victims.push({

      name:
        names[i].value.trim(),

      regNo:
        regs[i].value.trim()

    });

  }


  return victims;

}


/* =========================================
   SUBMIT
========================================= */

form.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    if (!validateCurrentStep()) {
      return;
    }


    const fate =
      document
        .getElementById("fateAccepted")
        .checked;


    if (!fate) {

      showError(
        "You must accept your fate."
      );

      return;

    }


    const payload = {

      syndicateName:
        document
          .getElementById("syndicateName")
          .value
          .trim(),

      victims:
        collectVictims(),

      disaster:
        document
          .getElementById("disaster")
          .value
          .trim(),

      fateAccepted:
        true

    };


    submitButton.disabled =
      true;


    submitButton.textContent =
      "SUBMITTING YOUR POOR DECISION...";


    try {

      const response =
        await fetch(
          API_URL,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body:
              JSON.stringify(payload)

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


      showError(
        error.message ||
        "Something went wrong."
      );


      submitButton.disabled =
        false;


      submitButton.textContent =
        "ACCEPT FATE";

    }

  }
);


/* =========================================
   SUCCESS
========================================= */

function showSuccess(id) {

  form.style.display =
    "none";


  document
    .querySelector(".progress-container")
    .style.display =
    "none";


  submissionId.textContent =
    id;


  successScreen.classList.add(
    "show"
  );


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =========================================
   ERROR
========================================= */

function showError(message) {

  alert(
    "ERROR:\n\n" + message
  );

}


/* =========================================
   CHARACTER COUNTERS
========================================= */

const syndicateInput =
  document.getElementById(
    "syndicateName"
  );


const syndicateCounter =
  document.getElementById(
    "syndicateCounter"
  );


syndicateInput.addEventListener(
  "input",
  function() {

    syndicateCounter.textContent =
      this.value.length;

  }
);


const disasterInput =
  document.getElementById(
    "disaster"
  );


const disasterCounter =
  document.getElementById(
    "disasterCounter"
  );


disasterInput.addEventListener(
  "input",
  function() {

    disasterCounter.textContent =
      this.value.length;

  }
);


/* =========================================
   INITIALIZE
========================================= */

updateStep();
