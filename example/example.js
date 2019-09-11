import GiftMessage from '../src/GiftMessage';

new GiftMessage(document.getElementsByClassName('js-giftmessage')[0], 34, function(u) {
    console.log(u.map(v => [v, v.length]));
}, { noEmojis: true });
