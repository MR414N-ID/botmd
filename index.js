const { create, vf } = require('@open-wa/wa-automate')
const { color, options } = require('./function')
const left = require('./lib/left')
const welcome = require('./lib/welcome')
const figlet = require('figlet')
const fs = require('fs-extra')
const ms = require('parse-ms')
const HandleMsg = require('./HandleMsg')

const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
}

const start = async (urbae = new urbae()) => {
    console.log(color('------------------------------------------------------------------------', 'white'))
    console.log(color(figlet.textSync('Lanox Bot', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color('------------------------------------------------------------------------', 'white'))
    console.log(color('[CREATOR]', 'aqua'), color('Lanox', 'magenta'))
    console.log(color('[BOT]', 'aqua'), color('Lanox Bot is now Online!', 'magenta'))
    console.log(color('[VER]', 'aqua'), color('2.10.0', 'magenta'))
    urbae.onStateChanged((state) => {
        console.log(color('-> [STATE]'), state)
        if (state === 'CONFLICT') urbae.forceRefocus()
        if (state === 'UNPAIRED') urbae.forceRefocus()
    })

    urbae.onAddedToGroup(async (chat) => {
        await urbae.sendText(chat.groupMetadata.id, 'Terima kasih sudah memasukkan bot kedalam grup kalian\nKetik /menu untuk menampilkan command')
    })

    urbae.onGlobalParticipantsChanged((async (heuh) => {
        await welcome(urbae, heuh)
        left(urbae, heuh)
    }))

    urbae.onMessage((message) => {
        urbae.getAmountOfLoadedMessages()
        .then(msg => {
          if (msg >= 3000) {
           urbae.cutMsgCache()
         }
      })
      HandleMsg(urbae, message)
    })

    urbae.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await urbae.sendText(callData.peerJid, 'Maaf sedang tidak bisa menerima panggilan.\n\n-bot')
            .then(async () => {
		await sleep(3000)
                // bot akan memblock nomor itu
                await urbae.contactBlock(callData.peerJid)
            })
    })
}
create(options(start))
    .then((urbae) => start(urbae))
    .catch((err) => console.error(err))
