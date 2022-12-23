const baseip = '192.168.1.169'
const IP = "http://" + baseip + "\:5000/api/reset-password-form";

// let tokenArray = [{ token: 'exampleT', username: 'exampleU' }];


// function addToken() {
//     fs.readFile('./tokens.json', 'utf8', function readFileCallback(err, data) {
//         if (err) {
//             console.log(err);
//         } else {
//             tokens = JSON.parse(data); //now it an object
//             tokens.push({ id: 2, square: 3 }); //add some data
//             json = JSON.stringify(tokens); //convert it back to json
//             fs.writeFile('./tokens.json', json, 'utf8', function (err) {
//                 if (err) throw err;
//                 console.log('complete');
//             }); // write it back 
//         }
//     });
// }

function getTokenObjectByUsername(tokenArrayInput, username) {

    let tokenArrayTemp = tokenArrayInput.map(tokenO => {
        let t = {
            token: tokenO.token,
            username: tokenO.username
        };
        if (t.username === username) {
            return t.token;
        }
    });
    tokenArrayTemp = tokenArrayTemp.filter(function (element) {
        return element !== undefined;
    });
    // console.log('test', tokenArrayTemp)
    return tokenArrayTemp;
}

module.exports = { IP, baseip, getTokenObjectByUsername };