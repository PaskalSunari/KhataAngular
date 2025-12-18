declare const require: any;
export const environment = {
  production: false,

  //appURL: 'https://api.khatasystem.com/api/',


  appURL:'https://localhost:7291/api/',

  reportSyncURL: 'https://mainapi.hospitalsnepal.com/api/',
  imageURL: 'https://mainapi.hospitalsnepal.com/api/',
  appVersion: require('../../package.json').version,
};
