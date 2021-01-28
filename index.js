const discord = require('discord.js');
const config = require('./config.json');
const request = require('request');
const translatte = require('translatte');
const utf8 = require('utf8');

const client = new discord.Client();
const urlJokeRandom = 'http://api.icndb.com/jokes/random';
const prefix = '$';

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        const requestConfig = {
            method: 'get',
            url: url,
            headers: {
                'Accept-Charset': 'UTF-8',
            },
            json: true,
        };
        request(requestConfig, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

function translateText(textToTranslate, originalLanguage = 'en', languageToTranslate = 'es') {
    return new Promise(async function (resolve, reject) {
        translatte(await textToTranslate, {
                from: originalLanguage,
                to: languageToTranslate
            }).then(res => {
                resolve(res);
            })
            .catch(err => {
                console.log("help");
                console.log(err);
                reject(err);
            });
    });
}

client.on("ready", () => {
    console.log(`¡${client.user.tag} esta listo!`);
});

client.on("message", async (message) => {
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    if (command === "joke") {
        try {
            const delay = await message.channel.send('El mensaje fue enviado con exito, espere un momento');
            await delay.delete({
                timeout: 10000
            });
            const requestPromise = await doRequest(urlJokeRandom);
            // console.log(requestPromise);
            const englishJoke = requestPromise.value.joke;
            // console.log(englishJoke);

            const spanishJoke = await translateText(englishJoke);
            message.reply(spanishJoke.text);
        } catch (error) {
            // handle error
        }
    }
});

// client.login(config.myToken);
//
client.login(config.my_token);