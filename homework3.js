/* 
 Name: Hailey Haiducek
 File: homework3.js
 Date Created: 6/30/2026
 Date Updated: 7/5/2026
 Purpose: External JavaScript file - Homework 3
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

/* SETUP - runs on body onload */
function setup() {
    document.getElementById("submit").style.display = "none";
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

/* End of file: homework3.js */
