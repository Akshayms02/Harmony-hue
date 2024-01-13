const twilio = require('twilio');

// Twilio credentials from your Twilio account
const accountSid = 'AC4a06a3e04068ce265df2997734e5215f';
const authToken = '074501e2bf40ab69647d1a2c26e7e1e8';
const twilioPhoneNumber = '+17178644442';

const client = twilio(accountSid, authToken);

// Function to send an SMS using Twilio
function sendSMS(toPhoneNumber, message) {
  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    })
    .then(message => console.log(`SMS sent: ${message.sid}`))
    .catch(error => console.error(`Error sending SMS: ${error.message}`));
}


const recipientPhoneNumber = '+91 9048727372'; 
const messageToSend = 'Hello from Twilio!';

sendSMS(recipientPhoneNumber, messageToSend);
