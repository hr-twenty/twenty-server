
exports.validateUserData = function(data) {
  var missing = [];
  if(!data.id) { missing.push('id');}
  if(!data.firstName) { missing.push('firstName');}
  if(!data.lastName) { missing.push('lastName');}
  if(!data.headline) { missing.push('headline');}
  if(!data.pictureUrl) { missing.push('pictureUrl');}
  if(data.numConnections === undefined) { missing.push('numConnections');}
  if(!data.industry) {missing.push('industry');}

  if (!data.location) {
    missing.push('location'); }
  else {
    if (!data.location.name) { missing.push('location name'); }

    if (!data.location.country) { missing.push('location country'); }
    else if (!data.location.country.code) { missing.push('location country code'); }
  }

  return missing;
};
