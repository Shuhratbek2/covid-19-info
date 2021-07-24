// Shuhrat;
//covid19 info bot

// npm paketlar
const { Telegraf, Markup, Router } = require("telegraf");
// const nodemon = require("nodemon")
const fetch = require("node-fetch")
const dotenv = require("dotenv")
dotenv.config();
const token = process.env.BOT_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

let userName = [];
let obunachilar = [];
const bot = new Telegraf(token);
const rasm = 'https://i2.wp.com/healthtechinsider.com/wp-content/uploads/CDC-COVID-bot.jpg?resize=600%2C275&ssl=1';

let keyArray = [
    ["Osiyo", 'Yevropa'], // Row1 with 2 buttons
    ['Afrika', 'Australiya va Okeaniya'], // Row2 with 2 buttons
    ["Shimoliy Amerika", "Janubiy Amerika"],
    ["Uzbekistan"]
]

bot.start(cxt => {

    let chat_id = cxt.chat.id;
    if (!obunachilar.includes(chat_id)) {
        obunachilar.push(chat_id);
        if (cxt.chat.username) userName.push(cxt.chat.username);
        else userName.length(cxt.chat.last_name + " bu user name emas")
    }
    cxt.reply(`Assalomu aleykum ${cxt.from.first_name} men Covid-19 info botman.` +
        `\nMen 220 ta davlat bo'yicha covid-19 virus haqidagi statistik ma'lumotini beraman \n\n` +
        `Mendan foydalanish uchun teskor tugmalardan foydalaning yoki "Davlat" nomini ingliz tilida yozing.\n` +
        `Eslatma: davlat nomlarini oldin bot orqali ko'rib chiqing, ba'zi davlatlar nomini qisqa yozish kerak. \n` +
        `Misol uchun USA. ` +
        `\nSizga yana qanday malumotlar qiziq bu haqida menga xabar yuboring! \n\n\n` +
        `Taklif va kamchiliklar haqida  @Suhayl_2020 ga xabar bering!`, Markup
        .keyboard(keyArray)
        .oneTime()
        .resize()
    ).then()

})



bot.command("/statika", cxt => {
    cxt.botInfo.can_read_all_group_messages = true;
    // console.log(cxt);
    if (cxt.chat.id === 643428965) {
        cxt.replyWithHTML(`Botning obunachilari ${obunachilar.length}`);
        cxt.replyWithHTML(`botdan foydalnagan Foydalanuvchilar ro'yhati` +
            userName.map(val => {
                return `\n <b> @` + val + `</b>`;
            }).join()
        ).then()
    }
})


// API manzili
const Url = "https://disease.sh/v3/covid-19/countries";
let array = [];
let uz = [];
let Africa = [
    []
]; //  1 Africa
let Asia = [
    []
]; //  2 Asia
let Australia_Oceania = [
    []
]; // 3 Australia-Oceania
let South_America = [
    []
]; // 4 South America
let Europe = [
    []
]; //  5 Europe         
let North_America = [
    []
]; // 6 North America

fetch(Url)
    .then((res) => res.json())
    .then(data => {
        //Uzbekiston
        uz.push(data[213])

        data.forEach((element, index) => {
            let caption = `Davlat: ${element.country},\nAholisi: ${element.population} ` +
                "\nJami kasallanganlar: " + element.cases + "\nBugun qayt etilganlar: " + element.todayCases +
                "\nVafot etganlar: " + element.deaths + "\nSog'ayganlar: " + element.recovered +
                `\nOldingi statistikalar bilan solishtirish uchun  \n#${element.country} hesh-tegidan foydalaning`;

            // tugma bosilganda
            bot.action(element.country, ctx => {

                let flag = element.countryInfo.flag;
                ctx.replyWithPhoto({
                    url: flag,
                }, {
                    caption: caption
                })
            })

            // davlat nomi yozganda
            bot.hears(element.country, ctx => {
                let flag = element.countryInfo.flag;
                ctx.replyWithPhoto({
                    url: flag,
                }, {
                    caption: caption
                })
            })


            let Obj = { text: element.country, callback_data: element.country }
            switch (element.continent) {
                case "Africa":
                    {
                        let n1 = Africa.length;
                        let n = Africa[n1 - 1].length;
                        Africa[n1 - 1].push(Obj);
                        if (n === 1) Africa.push([])
                        break;
                    }
                case "Asia":
                    {

                        let n1 = Asia.length;
                        let n = Asia[n1 - 1].length;
                        Asia[n1 - 1].push(Obj);
                        if (n === 1) Asia.push([])
                        break;
                    }
                case "Australia-Oceania":
                    {
                        let n1 = Australia_Oceania.length;
                        let n = Australia_Oceania[n1 - 1].length;
                        Australia_Oceania[n1 - 1].push(Obj);
                        if (n === 1) Australia_Oceania.push([])
                        break;
                    }
                case "South America":
                    {

                        let n1 = South_America.length;
                        let n = South_America[n1 - 1].length;
                        South_America[n1 - 1].push(Obj);
                        if (n === 1) South_America.push([])
                        break
                    }
                case "North America":
                    {

                        let n1 = North_America.length;
                        let n = North_America[n1 - 1].length;
                        North_America[n1 - 1].push(Obj);
                        if (n === 1) North_America.push([])

                        break;
                    }

                case "Europe":
                    {
                        let n1 = Europe.length;
                        let n = Europe[n1 - 1].length;
                        Europe[n1 - 1].push(Obj);
                        if (n === 1) Europe.push([])
                        break;
                    }
                default:

                    break;
            }
        });


    })
    .catch((err) => {
        console.log("xatolik " + err);
    })





bot.hears('Osiyo', (ctx) => {
    ctx.replyWithPhoto({
        url: rasm
    }, {
        caption: 'Osiyo',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(Asia)
    }).then()
})

bot.hears('Afrika', (ctx) => {
    ctx.replyWithPhoto({
        url: rasm
    }, {
        caption: 'Afrika',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(Africa)
    }).then()
})

bot.hears('Yevropa', (ctx) => {
    ctx.replyWithPhoto({
        url: rasm
    }, {
        caption: 'Yevropa',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(Europe)
    }).then()

})

bot.hears('Australiya va Okeaniya', (ctx) => {

    ctx.replyWithPhoto({
        url: rasm
    }, {
        caption: 'Australiya va Okeaniya',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(Australia_Oceania)
    }).then()

})

bot.hears('Shimoliy Amerika', (ctx) => {

    ctx.replyWithPhoto({
        url: rasm
    }, {
        caption: 'Shimoliy Amerika',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(North_America)
    }).then()

})


bot.hears('Janubiy Amerika', (ctx) => {

    ctx.replyWithPhoto({
        url: rasm
    }, {
        caption: 'Janubiy Amerika',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(South_America)
    }).then().catch(console.log("aha"))

})


bot.hears("Uzbekistan", cxt => {
    let flag = uz[0].countryInfo.flag;

    cxt.replyWithPhoto({
        url: flag,
    }, {
        caption: `Davlat: ${uz[0].country},\nAholisi: ${uz[0].population} ` +
            "\nJami kasallanganlar: " + uz[0].cases + "\nBugun qayt etilganlar: " + uz[0].todayCases +
            "\nVafot etganlar: " + uz[0].deaths + "\nSog'ayganlar: " + uz[0].recovered +
            `\nOldingi statistikalar bilan solishtirish uchun  \n#${uz[0].country} hesh-tegidan foydalaning`
    }).then()
})

bot.launch();