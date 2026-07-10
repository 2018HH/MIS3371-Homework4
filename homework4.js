/* 
 Name: Hailey Haiducek
 File: homework4.js
 Date Created: 7/7/2026
 Date Updated: 
 Purpose: External JavaScript file - Homework 4
*/

//https://jakeuh.github.io/MIS3371/hw4/hw4.html was used as a template for loop/switch structure and on-the-fly validation patterns

/* Error messages - false fields are optional */
let fieldErrors = {
    firstname: true,
    middleinit: false,   
    lastname: true,
    dob: true,
    ssn: true,
    addr1: true,
    addr2: false,       
    city: true,
    state: true,
    zip: true,
    phone: false,       
    email: true,
    userid: true,
    password: true,
    confirmpassword: true
};

/* Field Lists | Local storage: SSN and both password fields are intentionally omitted since they are secure data */
const SAFE_TEXT_FIELDS = [
    "firstname", "middleinit", "lastname", "dob",
    "addr1", "addr2", "city", "state", "zip",
    "phone", "email", "symptoms", "userid", "health"
 ];
const SAFE_CHECKBOX_IDS = [
    "prefemail", "smstext", "phonecall", "voicemail", "direct"
 ];
const SAFE_RADIO_GROUPS = [
    "gender", "vaccinated", "insurance"
 ];
const STORAGE_PREFIX = "patientForm_";
const COOKIE_NAME = "patientFirstName";

/* SETUP - runs on body onload */
function setup() {
    document.getElementById("submit").style.display = "none";

// Fetch API: pull state list from separate file
loadStates();

// Cookie verification
checkReturningUser();

// Attach auto-save to local storage listeners for every field
attachStorageAutosave();

// Content protection: on-scroll sticky header (see CSS .sticky class)
initStickyHeader();
}

/* Content Protection - On-Scroll Sticky Header (adapted from w3schools.com/howto/howto_css_fixed_header.asp, the same tutorial linked in the assignment.
Footer uses fixed rule and the separate "fixed footer" technique from the same assignment. Both required techniques are demonstrated on two different elements.
*/
function initStickyHeader() {
    let header = document.getElementById("header");
    let stickyPoint = header.offsetTop;

    window.onscroll = function () {
        if (window.pageYOffset > stickyPoint) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    };
}

/* Fetch API */

// Load state dropdown from states.json
async function loadStates() {
    const stateSelect = document.getElementById("state");
    try {
         const response = await fetch("states.json");
         if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
         }
         const states = await response.json();

     // Clear "Loading states... placeholder, then rebuild list
     stateSelect.innerHTML = "";
     let blank = document.createElement("optiom");
     blank.value = ""
     blank.textContent = "Select State"
     stateSelect.appendChild(blank);

     states.forEach(function (st) {
       let opt = document.createElement("option")
       opt.value = st.code;
       opt.textContent = st.name;
       stateSelect.appendChild(opt);
     });
/* If there is a saved state value from a previous visit, re-select it (loadFromStorage runs later, but the
select has to be populated first) */
     if (localStorage.getItem(STORAGE_PREFIX + "state")) {
         stateSelect.value = localStorage.getItem(STORAGE_PREFIX + "state");
     }
    //If fetch fails, don't leave user with broken dropdown
    } catch (err) {
        stateSelect.innerHTML = '<option value"">Unable to load states</option>';
        console.error("Could not load states.json:", err);
    }
}

/* Cookies (w3schools.com/js/js_cookies.asp was used as a template */
function setCookie(name, value, hours) {
   let d = new Date();
   d.setTime(d.getTime() + hours * 60 * 60 * 1000);
   let expires = "expires=" + d.toUTCString();
   document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
   let cname = name + "=";
   let decoded = decodeURIComponent(document.cookie);
   let parts = decoded.split(";");
   for (let i=0; i < parts.length; i++) {
      let part = parts[i].trim();
      if (part.indexOf(cname) === 0) {
         return part.substring(cname.length);
      }
   }
   return "";
}

function eraseCookie(name) {
   document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

/* Runs one time on page load and looks for the first-name cookie - user is then either welcomed back or greeted as a new user */
function checkReturningUser() {
    let greeting = document.getElementById("greetingMessage");
    let notMeLink = document.getElementById("notMeLink");
    let savedName = getCookie(COOKIE_NAME);

    if (savedname !== "") {
       let isThem = confirm(
          "Welcome back " + savedName + ".\nPress OK to confirm, or Cancel if this is not " + savedName + "."
        );

     if (isThem) {
        greeting.innerHTML = "Welcome back, " + savedName + "!";
        document.getElementById("firstname").value = savedName;

      //Opt out link in case user wants to switch users in the same session
      notMeLink.innerHTML = 'Not ' + savedName + '? <a href="#" onclick="startNewUser(); return false;
                             ">Click here to start as a new user. </a>';
      notMeLink.style.display = "block";

      //Pull the rest of their remembered data back into the form
      loadFormFromStorage();
     } else {
       //If visitor states "this isn't me", they are treated like a new user
       startNewUser();
     }
    } else {
        greeting.innerHTML = "Welcome, new user!";
        notMeLink.style.display = "none";
    }
}

/* Called when visitor clicks "Not <name>? Click here to create a new user."
   Cookie is then expired, local storage is wiped, and form is cleared.
*/
function startNewUser() {
    eraseCookie(COOKIE_NAME);
    clearFormStorage();
    document.getElementById("patientform").reset();
    removeData();

    document.getElementById("greetingMessage").innerHTML = "Welcome, new user!";
    document.getElementById("notMeLine").style.display = "none";
    document.getElementById("notMeLink").innerHTML = "";
}

//Local storage (localStorage pattern from w3schools.com/jsref/prop_win_localstorage.asp)
function saveToStorage(key, value) {
    localStorage.setItem(STORAGE_PREFIX + key, value);
}

function removeFromStorage(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
}

//Attaches "save as you leave" field listeners to every safe field (not for SSN and password fields)
function attachStorageAutosave() {
   SAFE_TEXT_FIELDS.forEach(function (id) {
       let el = document.getElementById(id);
       if (!el) return;
       let evt = (el.tagName === "SELECT" || el.type === "range" ? "change" : "blur");

       el.addEventListener(evt, function () {
          saveToStorage(id, this.value);
       });
   });
   SAFE_CHECKBOX_IDS.forEach(function (id) {
       let el = document.getElementById(id);
       if (!el) return;
       el.addEventListener("change", function () {
          saveToStorage(id, this.checked);
       });
   });

   SAFE_RADIO_GROUPS.forEach(function (groupName) {
       let radios = document.getElementsByName(groupName);
       radios.forEach(function (radio) {
          radio.addEventListener("change", function () {
             if (this.checked) {
                saveToStorage(groupName, this.value);
             }
          });
       });

     // "Remember Me" checkbox (unchecking immediately forgets visitor
    let rememberMe = document.getElementById("rememberMe");
    rememberMe.addEventListener("change", function() {
      if(!this.checked) {
         eraseCookie(COOKIE_NAME);
         clearFormStorage();
      } else {
        // Re-checking it re-saves what is currently in the form
        let firstname = document.getElementById("firstname").value;
        if (firstname !== "") {
          setCookie(COOKIE_NAME, firstname, 48);
        }
      }
    });
   }
/* Reads everything back out from localStorage into matching form fields
   (only runs if returning visitor cookie is located */
function loadFormFromStorage() {
   SAFE_TEXT_FIELDS.forEach(function (id) {
       let saved = localStorage.getItem(STORAGE_PREFIX + id);
       let el = document.getElementById(id);
       if (saved !== null && el) {
          el.value = saved;
       }
   });
 SAFE_CHECKBOX_IDS.forEach(function (id) {
      let saved = localStorage.getItem(STORAGE_PREFIX + id);
      let el document.getElementById(id)
      if (saved === "true" && el) {
        el.checked = true;
      }
 });

  SAFE_RADIO_GROUPS.forEach(function (groupName) {
      let saved = localStorage.getItem(STORAGE_PREFIX + groupName);
      if (saved !== null) {
          let radios = document.getElementsByName(groupName);
          radios.forEach(function (radio) {
            if (radio.value === saved) {
               radio.checked = true;
      }
    });
   }
 });

 // Load health value back on the slider's number display
 updateSlider();

// Removes every key this form ever wrote to localStorage
function clearFormStorage() {
   SAFE_TEXT_FIELDS.forEach(function (id) {
      removeFromStorage(id);
   });
   SAFE_CHECKBOX_IDS.forEach(function (id) {
      removeFromStorage(id);
   });
   SAFE_RADIO_GROUPS.forEach(function (groupName) {
      removeFromStorage(groupName);
   });
}
/* First name - 2-30 characters, letters/apostrophes/hyphens/spaces only */
function checkFirstName() {
    let val = document.getElementById("firstname").value;
    let msg = document.getElementById("firstname_message");
    let re = /^[A-Za-z'\- ]{2,30}$/;

    if (val.length === 0) {
        msg.innerHTML = "First name is required.";
        fieldErrors.firstname = true;
    } else if (!re.test(val)) {
        msg.innerHTML = "2-30 letters, apostrophes and hyphens only.";
        fieldErrors.firstname = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.firstname = false;
    }
}

/* Middle initial - optional, single letter if entered */
function checkMiddle() {
    let val = document.getElementById("middleinit").value;
    let msg = document.getElementById("middle_message");
    let re = /^[A-Za-z]?$/;

    if (!re.test(val)) {
        msg.innerHTML = "One letter only.";
        fieldErrors.middleinit = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.middleinit = false;
    }
}

/* Last name - 2-30 characters, letters/apostrophes/hyphens/spaces only */
function checkLastName() {
    let val = document.getElementById("lastname").value;
    let msg = document.getElementById("lastname_message");
    let re = /^[A-Za-z'\- ]{2,30}$/;

    if (val.length === 0) {
        msg.innerHTML = "Last name is required.";
        fieldErrors.lastname = true;
    } else if (!re.test(val)) {
        msg.innerHTML = "2-30 letters, apostrophes and hyphens only.";
        fieldErrors.lastname = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.lastname = false;
    }
}

/* DOB - Required. Cannot be in the future or more than 120 years ago */
function checkDOB() {
    let val = document.getElementById("dob").value;
    let msg = document.getElementById("dob_message");

    if (val === "") {
        msg.innerHTML = "Date of birth is required.";
        fieldErrors.dob = true;
        return;
    }

    // Force local-time parsing so the entered date doesn't shift a day - debugged from https://jakeuh.github.io/MIS3371/hw4/hw4.html example code via Claude 
    let dobDate = new Date(val + "T00:00:00");
    let today = new Date();
    let earliest = new Date();
    earliest.setFullYear(today.getFullYear() - 120);

    if (dobDate > today) {
        msg.innerHTML = "Date of birth cannot be in the future.";
        fieldErrors.dob = true;
    } else if (dobDate < earliest) {
        msg.innerHTML = "Date of birth cannot be more than 120 years ago.";
        fieldErrors.dob = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.dob = false;
    }
}

/* SSN - Auto-format with dashes as the user types (123-45-6789) */
function formatSSN() {
    let ssnInput = document.getElementById("ssn");
    let digits = ssnInput.value.replace(/[^\d]/g, "").substring(0, 9);
    let formatted = digits;

    if (digits.length > 5) {
        formatted = digits.slice(0, 3) + "-" + digits.slice(3, 5) + "-" + digits.slice(5);
    } else if (digits.length > 3) {
        formatted = digits.slice(0, 3) + "-" + digits.slice(3);
    }
    ssnInput.value = formatted;
}

function checkSSN() {
    let val = document.getElementById("ssn").value;
    let msg = document.getElementById("ssn_message");
    let digits = val.replace(/[^\d]/g, "");

    if (digits.length === 0) {
        msg.innerHTML = "Social Security Number is required.";
        fieldErrors.ssn = true;
    } else if (digits.length !== 9) {
        msg.innerHTML = "Enter exactly 9 digits.";
        fieldErrors.ssn = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.ssn = false;
    }
}

/* Address Line 1 - required, 2-30 characters */
function checkAddress1() {
    let val = document.getElementById("addr1").value;
    let msg = document.getElementById("address1_message");

    if (val.length < 2 || val.length > 30) {
        msg.innerHTML = "Address line 1 must be 2-30 characters.";
        fieldErrors.addr1 = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.addr1 = false;
    }
}

/* Address Line 2 - optional, 2-30 characters if entered */
function checkAddress2() {
    let val = document.getElementById("addr2").value;
    let msg = document.getElementById("address2_message");

    if (val.length === 0) {
        msg.innerHTML = "";
        fieldErrors.addr2 = false;
    } else if (val.length < 2 || val.length > 30) {
        msg.innerHTML = "If entered, must be 2-30 characters.";
        fieldErrors.addr2 = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.addr2 = false;
    }
}

/* City - required, letters/spaces only, 2-30 characters */
function checkCity() {
    let val = document.getElementById("city").value;
    let msg = document.getElementById("city_message");
    let re = /^[A-Za-z ]{2,30}$/;

    if (val.length === 0) {
        msg.innerHTML = "City is required.";
        fieldErrors.city = true;
    } else if (!re.test(val)) {
        msg.innerHTML = "Letters only, 2-30 characters.";
        fieldErrors.city = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.city = false;
    }
}

/* State - required dropdown, no default selection */
function checkState() {
    let val = document.getElementById("state").value;
    let msg = document.getElementById("state_message");

    if (val === "") {
        msg.innerHTML = "Please choose a state.";
        fieldErrors.state = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.state = false;
    }
}

/* Zip code - required, exactly 5 digits */
function checkZip() {
    let val = document.getElementById("zip").value;
    let msg = document.getElementById("zip_message");
    let re = /^[0-9]{5}$/;

    if (val.length === 0) {
        msg.innerHTML = "ZIP code is required.";
        fieldErrors.zip = true;
    } else if (!re.test(val)) {
        msg.innerHTML = "Enter exactly 5 digits.";
        fieldErrors.zip = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.zip = false;
    }
}

/* Phone - format 713-555-1234; slicing technique referenced from https://jakeuh.github.io/MIS3371/hw4/hw4.html example */
function formatPhone() {
    let phoneInput = document.getElementById("phone");
    let digits = phoneInput.value.replace(/[^\d]/g, "").substring(0, 10);
    let formatted = digits;

    if (digits.length > 6) {
        formatted = digits.slice(0, 3) + "-" + digits.slice(3, 6) + "-" + digits.slice(6);
    } else if (digits.length > 3) {
        formatted = digits.slice(0, 3) + "-" + digits.slice(3);
    }
    phoneInput.value = formatted;
}

function checkPhone() {
    let val = document.getElementById("phone").value;
    let msg = document.getElementById("phone_message");
    let re = /^\d{3}-\d{3}-\d{4}$/;

    if (val.length === 0) {
        msg.innerHTML = "";
        fieldErrors.phone = false;
    } else if (!re.test(val)) {
        msg.innerHTML = "Format must be 713-555-1234.";
        fieldErrors.phone = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.phone = false;
    }
}

/* Email - required, name@domain.tld */
function checkEmail() {
    let val = document.getElementById("email").value;
    let msg = document.getElementById("email_message");
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val.length === 0) {
        msg.innerHTML = "Email is required.";
        fieldErrors.email = true;
    } else if (!re.test(val)) {
        msg.innerHTML = "Enter a valid email address (name@domain.tld).";
        fieldErrors.email = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.email = false;
    }
}

/* Health Slider */
function updateSlider() {
    let val = document.getElementById("health").value;
    document.getElementById("rangedisplay").innerHTML = val;
}

/* User ID - 5-20 characters, can't start with a number,letters/numbers/dash/underscore only, no spaces. */
function checkUserID() {
    let val = document.getElementById("userid").value;
    let msg = document.getElementById("userid_message");
    let re = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;

    if (val.length === 0) {
        msg.innerHTML = "User ID is required.";
        fieldErrors.userid = true;
    } else if (!re.test(val)) {
        msg.innerHTML = "5-20 chars, can't start with a number, letters/numbers/-/_ only.";
        fieldErrors.userid = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.userid = false;
    }

    // Password can't equal the user ID, so re-check password when the user ID changes.
    if (document.getElementById("password").value !== "") {
        checkPassword();
    }
}

/* Password - At least 8 characters, 1 upper, 1 lower, 1 digit,and cannot equal the desired User ID.(HTML only gives us 4 hint spans, so they're grouped below.) */
function checkPassword() {
    let val = document.getElementById("password").value;
    let userid = document.getElementById("userid").value;

    let msgUpper = document.getElementById("password_message1");
    let msgLower = document.getElementById("password_message2");
    let msgDigit = document.getElementById("password_message3");
    let msgLength = document.getElementById("password_message4");

    let hasUpper = /[A-Z]/.test(val);
    let hasLower = /[a-z]/.test(val);
    let hasDigit = /[0-9]/.test(val);
    let longEnough = val.length >= 8;
    let matchesUserID = (userid !== "" && val === userid);

    msgUpper.innerHTML = hasUpper ? "" : "Needs at least 1 upper case letter.";
    msgLower.innerHTML = hasLower ? "" : "Needs at least 1 lower case letter.";
    msgDigit.innerHTML = hasDigit ? "" : "Needs at least 1 digit.";

    if (!longEnough) {
        msgLength.innerHTML = "Needs at least 8 characters.";
    } else if (matchesUserID) {
        msgLength.innerHTML = "Password cannot be the same as your User ID.";
    } else {
        msgLength.innerHTML = "";
    }

    fieldErrors.password = !(hasUpper && hasLower && hasDigit && longEnough && !matchesUserID);

    // Re-check the confirm-password field any time password changes
    if (document.getElementById("confirmpassword").value !== "") {
        checkPasswordMatch();
    }
}

/* Confirm Password - must match Password field */
function checkPasswordMatch() {
    let pw = document.getElementById("password").value;
    let confirm = document.getElementById("confirmpassword").value;
    let msg = document.getElementById("password2_message");

    if (confirm === "") {
        msg.innerHTML = "Please confirm your password.";
        fieldErrors.confirmpassword = true;
    } else if (pw !== confirm) {
        msg.innerHTML = "Passwords do not match.";
        fieldErrors.confirmpassword = true;
    } else {
        msg.innerHTML = "";
        fieldErrors.confirmpassword = false;
    }
}

/* Validate Button */
function checkForm() {
    // Force lower case on email before validating
    let emailField = document.getElementById("email");
    emailField.value = emailField.value.toLowerCase();

    checkFirstName();
    checkMiddle();
    checkLastName();
    checkDOB();
    checkSSN();
    checkAddress1();
    checkAddress2();
    checkCity();
    checkState();
    checkZip();
    checkPhone();
    checkEmail();
    checkUserID();
    checkPassword();
    checkPasswordMatch();

    let errorCount = 0;
    for (let key in fieldErrors) {
        if (fieldErrors[key]) {
            errorCount++;
        }
    }

    let submitBtn = document.getElementById("submit");
    if (errorCount === 0) {
        submitBtn.style.display = "inline-block";
    } else {
        submitBtn.style.display = "none";
        alert("Please fix the indicated errors before submitting.");
    }
}

/* Review Button */
function getData() {
    let formcontents = document.getElementById("patientform");
    let formoutput;
    let datatype;
    let i;

    formoutput = "<table class='output'><tr><th>Data Name</th><th>Type</th><th>Value</th></tr>";

    for (i = 0; i < formcontents.length; i++) {
        datatype = formcontents.elements[i].type;

        switch (datatype) {
            case "checkbox":
                if (formcontents.elements[i].checked) {
                    formoutput += "<tr><td align='right'>" + formcontents.elements[i].name + "</td>";
                    formoutput += "<td align='right'>" + datatype + "</td>";
                    formoutput += "<td class='outputdata'>" + formcontents.elements[i].value + "</td></tr>";
                }
                break;
            case "radio":
                if (formcontents.elements[i].checked) {
                    formoutput += "<tr><td align='right'>" + formcontents.elements[i].name + "</td>";
                    formoutput += "<td align='right'>" + datatype + "</td>";
                    formoutput += "<td class='outputdata'>" + formcontents.elements[i].value + "</td></tr>";
                }
                break;
            case "button":
            case "submit":
            case "reset":
                break;
            case "password":
                formoutput += "<tr><td align='right'>" + formcontents.elements[i].name + "</td>";
                formoutput += "<td align='right'>" + datatype + "</td>";
                formoutput += "<td class='outputdata'>(hidden)</td></tr>";
                break;
            default:
                formoutput += "<tr><td align='right'>" + formcontents.elements[i].name + "</td>";
                formoutput += "<td align='right'>" + datatype + "</td>";
                formoutput += "<td class='outputdata'>" + formcontents.elements[i].value + "</td></tr>";
        }
    }

    formoutput += "</table>";
    document.getElementById("outputformdata").innerHTML = formoutput;
}

/* Reset Button */
function removeData() {
    document.getElementById("outputformdata").innerHTML = "(form was reset)";
    document.getElementById("submit").style.display = "none";

    // clear all the visible error/hint messages
    document.querySelectorAll(".error, .passwordhint").forEach(function (el) {
        el.innerHTML = "";
    });

    // reset flags back to their required/optional defaults
    fieldErrors = {
        firstname: true,
        middleinit: false,
        lastname: true,
        dob: true,
        ssn: true,
        addr1: true,
        addr2: false,
        city: true,
        state: true,
        zip: true,
        phone: false,
        email: true,
        userid: true,
        password: true,
        confirmpassword: true
    };
}

/* End of file: homework4.js */
