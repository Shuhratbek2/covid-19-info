// Shuhrat;
//covid19 info bot

// npm paketlar
const { Telegraf, Markup, Router } = require("telegraf");
const nodemon = require("nodemon")
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

let keyArray = [
    ["Davlatlar 1-50", ' Davlatlar 50-100'], // Row1 with 2 buttons
    ['Davlatlar 100-160', 'Davlatlar 160-222'], // Row2 with 2 buttons
    ["Uzbekiston"]
    // ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
]

bot.start(cxt => {
    let chat_id = cxt.chat.id;
    if (!obunachilar.includes(chat_id)) {
        obunachilar.push(chat_id);
        if (cxt.chat.username) userName.push(cxt.chat.username);
        else userName.length(cxt.chat.last_name)
    }
    cxt.reply(`Assalomu aleykum men info botman \n Men sizga covid-19 bo'yicha statistik ma'lumot beraman \n` +
        `Men 222 davlat haqida ma'lumot berishim mumkin.\n\n Sizga yana qanday malumotlar qiziq bu haqida menga xabar bering! \n` +
        `Taklif va kamchiliklar haqida  @Suhayl_2020 ga xabar bering`, Markup
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
                cxt.replyWithHTML(`botdan foydalnagan Foydalanuvchilar ro'yhati  ${
                        
                            userName.map(val =>{
                                return `\n <b> @`+ val +`</b>`;
                            }).join()
                        }`).then()
                }
})


// API manzili
const Url = "https://disease.sh/v3/covid-19/countries";
let array = []
let uz = []
fetch(Url)
    .then((res) => res.json())
    .then(data => {
        data.forEach((element, index) => {
            array.push({ text: element.country, callback_data: index })
            uz.push(data[213])
        });
        let j = 0;
        dom()
    })
    .catch((err) => {
        console.log(err);
    })


let btnArr1 = []
let btnArr2=[]
let btnArr3 =[]
let btnArr4=[]

let h1 = -1;
let h2 =-1;
let h3= -1
let h4=-1;

function dom() {
    array.forEach((element, index) => {
        if (index % 2 == 0 && index < 50) {
            btnArr1.push([])
            h1++
        }
        if(index<50) btnArr1[h1].push(element)

        // index 50 dan keyin 
        if (index % 2 == 0 && index >=50  && index < 100) {
            btnArr2.push([])
            h2++
        }
        if (index >= 50 && index < 100) btnArr2[h2].push(element)

        //100dan 161gach

        if(index % 2 == 0 && index >= 100 && index < 160){
            btnArr3.push([])
            h3++
        } 
        if(index >= 100 && index < 160)btnArr3[h3].push(element);

        //161 dn keyin 
        if(index % 2 == 0 && index >= 160){
            btnArr4.push([])
            h4++

        } 
        if(index >=160 ) btnArr4[h4].push(element);

    })

}

const rasm = 'https://i2.wp.com/healthtechinsider.com/wp-content/uploads/CDC-COVID-bot.jpg?resize=600%2C275&ssl=1';
bot.hears('Davlatlar 1-50', (ctx) => {
    
    ctx.replyWithPhoto({ url: rasm }, {
        caption: 'Caption',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(btnArr1)
    }).then()
})
bot.hears('Davlatlar 50-100', (ctx) => {
    ctx.replyWithPhoto({ url: rasm }, {
        caption: 'Caption',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(btnArr2)
    }).then()
})
bot.hears('Davlatlar 100-160', (ctx) => {
     ctx.replyWithPhoto({ url: rasm }, {
        caption: 'Caption',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(btnArr3)
    }).then()

})
bot.hears('Davlatlar 160-222', (ctx) => {

     ctx.replyWithPhoto({ url: rasm }, {
        caption: 'Caption',
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(btnArr4)
    }).then()

})


for (let i = 0; i <= 222; i++) {
    bot.action(i + "", ctx => {
        fetch(Url)
            .then((res) => res.json())
            .then(data => {
                let flag = data[i].countryInfo.flag;
                ctx.replyWithPhoto({
                    url: flag,
                }, {
                    caption: `Davlat: ${data[i].country},\nAholisi: ${data[i].population} ` +
                        "\nJami kasallanganlar: " + data[i].cases + "\nBugun qayt etilganlar: " + data[i].todayCases +
                        "\nVafot etganlar: " + data[i].deaths + "\nSog'ayganlar: " + data[i].recovered+
                        `\nOldingi statistikalar bilan solishtirish uchun  \n#${data[i].country} hesh-tegidan foydalaning`
                })
            })
            .catch((err) => {
                ctx.reply(err)
                console.log(err);
            })
    })
}
bot.hears("Uzbekiston", cxt=>{
    let flag = uz[0].countryInfo.flag;

    cxt.replyWithPhoto( {
        url: flag,
    },{caption: `Davlat: ${uz[0].country},\nAholisi: ${uz[0].population} ` +
    "\nJami kasallanganlar: " + uz[0].cases + "\nBugun qayt etilganlar: " + uz[0].todayCases +
    "\nVafot etganlar: " + uz[0].deaths + "\nSog'ayganlar: " + uz[0].recovered+
    `\nOldingi statistikalar bilan solishtirish uchun  \n#${uz[0].country} hesh-tegidan foydalaning`
}
).then()
})
bot.launch();