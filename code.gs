function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('แบบประเมิน');
}

// Fetch the list of services from the Service sheet
function getServices() {
  const sheet = SpreadsheetApp.openById('1xUCXlYzdRPVvokJ9plSTIlN0m5oH_bv0Xo4vBgTPS6s').getSheetByName('Service');
  const services = sheet.getRange(2, 1, sheet.getLastRow() - 1).getValues().flat(); // Exclude header row
  return services;
}

// Save the rating to the Score sheet
function submitRating(service, rating) {
  const sheet = SpreadsheetApp.openById('1xUCXlYzdRPVvokJ9plSTIlN0m5oH_bv0Xo4vBgTPS6s').getSheetByName('score');
  sheet.appendRow([new Date(), service, rating]);

  let date = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss")  

  sendNotifyToTelegram(date, service, rating)

}

//Send Alarm to telegram
function sendNotifyToTelegram(date, service, rating) {
  let token = "7610236171:AAGjOCkNv-v-5cb2fkbg2w3gemuYLNouPDU";
  let chatId = "8114248243";

  let message = "มีการประเมินความพึงพอใจ" + "\n" +
    "เวลา : " + date + "\n" +
    "หัวข้อ : " + service + " \n" + 
    "คะแนน : " + rating ;

  var telegramUrl = 'https://api.telegram.org/bot' + token + '/sendMessage';

  var payload = {
    'chat_id': chatId,
    'text': message,
    'parse_mode': 'Markdown'
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(telegramUrl, options);

}
