//Dependencies
//const config = require('./config');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Container for all the helpers
let helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof (str) == 'string' && str.length > 0) {
    let hash = crypto.createHmac('sha256', 'thisIsASecret').update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (strLength) => {
  strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for (i = 1; i <= strLength; i++) {
      // Get a random charactert from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      // Append this character to the string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

/*
*
*
*
*/

let config = {
  'templateGlobals': {
    'appName': 'nodejs e shop',
    'companyName': '*******, Inc.',
    'yearCreated': '2021',
    'baseUrl': 'http://localhost:3000/'
  }
}

// Get the string content of a template
// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = (templateName,data,callback) => {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};
  if(templateName){
    var templatesDir = path.join(__dirname,'/../templates/');
    fs.readFile(templatesDir+templateName+'.html', 'utf8', (err,str)=>{
      if(!err && str && str.length > 0){
        
        // Do interpolation on the string
        var finalString = helpers.interpolate(str,data);
        callback(false,finalString);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};



// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = (str,data,callback)=>{
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  // Get the header
  helpers.getTemplate('_header',data,function(err,headerString){
    if(!err && headerString){
      // Get the footer
      helpers.getTemplate('_footer',data,function(err,footerString){
        if(!err && headerString){
          // Add them all together
          var fullString = headerString+str+footerString;
          callback(false,fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
};


// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = (str, data) => {
  str = typeof (str) == 'string' && str.length > 0 ? str : '';
  data = typeof (data) == 'object' && data !== null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with "global."
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.' + keyName] = config.templateGlobals[keyName]
    }
  }

  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof (data[key] == 'string')) {
      var replace = data[key];
      var find = '{' + key + '}';
      str = str.replace(find, replace);
    }
  }
  return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName,callback)=>{
  
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if(fileName){
    var publicDir = path.join(__dirname,'/../public/');
    fs.readFile(publicDir+fileName, function(err,data){
      if(!err && data){
        callback(false,data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
  
};

// Export the module
module.exports = helpers;