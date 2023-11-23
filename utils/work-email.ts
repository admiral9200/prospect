/*
Example usage:
const email1 = "john.doe@example.com"; // Valid email
const email2 = "jane.smith@yahoo.com";  // Invalid email (yahoo.com is not allowed)
*/

export default function isValidWorkEmail(email: string) {
  // Regular expression for a valid email address
  // Gotten from: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const excludedDomains = [
    "yahoo.com",
    "gmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
    "tempmail.org",
    "fakeinbox.com",
    "sharklasers.com",
    "yopmail.com",
    "getairmail.com",
    "trashmail.com",
    "dispostable.com",
    "maildrop.cc",
    "33mail.com",
    "byebyemail.com",
    "emailondeck.com",
    "mailnesia.com",
    "notsharingmy.info",
    "temp-mail.org",
    "throwawaymail.com",
  ];

  const domain = email.split("@")[1];

  if (regex.test(email) && !excludedDomains.includes(domain)) {
    return true;
  }

  return false;
}
