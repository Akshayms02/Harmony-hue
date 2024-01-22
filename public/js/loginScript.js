const emailid = document.getElementById("typeEmailX");
const passid = document.getElementById("typePasswordX");
const error1 = document.getElementById("error1");
const error2 = document.getElementById("error2");
const logform = document.getElementById("logform");

//Timer for the resend button to be displayed;

document.addEventListener("DOMContentLoaded", () => {
  // Get the link element
  let resendOtp = document.getElementById("resendOtp");
  let timerSpan = document.getElementById("timer");
  let otpExpiryTimer = document.getElementById("otpExpiryTimer");
  // Disable the link on page load (calling the function)
  disableLink(resendOtp, timerSpan, 15);

  
  otpExpiry(otpExpiryTimer, 90);



  // Function for disabling the link
  function disableLink(link, timer, durationInSeconds) {
    link.classList.add("disabled");
    link.removeAttribute("href");
    let countdown = durationInSeconds;
    let upDateTimer = () => {
      //Function for updating the text for the timer
      timer.innerText = `00:${countdown}`;
    };
    upDateTimer();

    let countdownInterval = setInterval(() => {
      countdown--;

      if (countdown <= 0) {
        // Enabling the link after the countdown
        link.classList.remove("disabled");
        link.setAttribute("href", "/verify");
        clearInterval(countdownInterval);
        timer.innerText = ""; //Clearing the text inside the timer
      } else {
        upDateTimer();
      }
    }, 1000);
  }
  function otpExpiry(timer, duration) {
    let expiryCountdown;
    let storedExpiryCountdown = sessionStorage.getItem("expiryCountdown");

    if (storedExpiryCountdown) {
      expiryCountdown = parseInt(storedExpiryCountdown, 10);
    } else {
      expiryCountdown = duration;
      sessionStorage.setItem("expiryCountdown", expiryCountdown);
    }

    let OtpUpDateTimer = () => {
      const minutes = Math.floor(expiryCountdown / 60);
      const seconds = expiryCountdown % 60;
      timer.innerText = `Your OTP will be expired in: ${minutes}m ${seconds}s`;
    };
    OtpUpDateTimer();

    let countdownIntervalForOtpExpiry = setInterval(() => {
      expiryCountdown--;

      if (expiryCountdown <= 0) {
        clearInterval(countdownIntervalForOtpExpiry);
        timer.innerHTML = ""; // Clearing the text inside the timer
        sessionStorage.removeItem("expiryCountdown"); // Clear the stored countdown on expiration
      } else {
        OtpUpDateTimer();
        sessionStorage.setItem("expiryCountdown", expiryCountdown); // Update the stored countdown
      }
    }, 1000);
  }
});

function emailvalidate(e) {
  const emailval = emailid.value;
  const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z.-]+).([a-zA-z]{2,4})$/;
  if (!emailpattern.test(emailval)) {
    error1.style.display = "block";
    error1.style.color = "yellow";
    error1.style.marginLeft = "18px";

    error1.innerHTML = "Invalid Format!!";
  } else {
    error1.style.display = "none";
    error1.innerHTML = "";
  }
}

function passvalidate(e) {
  const passval = passid.value;
  const alpha = /[a-zA-Z]/;
  const digit = /\d/;
  if (passval.length < 8) {
    error2.style.display = "block";
    error2.style.color = "yellow";
    error2.style.marginLeft = "18px";
    error2.innerHTML = "Must have atleast 8 characters";
  } else if (!alpha.test(passval) || !digit.test(passval)) {
    error2.style.display = "block";
    error2.style.color = "yellow";
    error2.style.marginLeft = "18px";
    error2.innerHTML = "Should contain Numbers and Alphabets!!";
  } else if (passval.trim() === "") {
    error2.style.display = "block";
    error2.style.color = "yellow";
    error2.style.marginLeft = "18px";
    error2.innerHTML = "Please Enter the password.";
  } else {
    error2.style.display = "none";
    error2.innerHTML = "";
  }
}

emailid.addEventListener("blur", emailvalidate);
passid.addEventListener("blur", passvalidate);

logform.addEventListener("submit", function (e) {
  emailvalidate();
  passvalidate();

  if (
    error1.innerHTML === "Invalid Format" ||
    error2.innerHTML === "Must have atleast 8 characters" ||
    error2.innerHTML === "Should contain Numbers and Alphabets!!"
  ) {
    e.preventDefault();
  }
});
