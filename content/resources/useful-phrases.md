<script>
function speak(text) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}
</script>
<style>
.sp{background:none;border:none;cursor:pointer;font-size:14px;padding:0 0 0 4px;vertical-align:middle;opacity:0.6;}
.sp:hover{opacity:1;}
</style>

# Useful Chinese Phrases · For Italian First-Timers

Pronunciation guide: **ǐ** = short "ee", **ü** = like French "u", **zh** = like "j" in "judge", **x** = like "sh" but softer, **q** = like "ch" but lighter, **c** = like "ts"

The 3 Chinese members will handle most communication. These phrases are for when you're separated, ordering food independently, or just want to connect with locals.

Click <button class="sp" onclick="speak('你好')">🔊</button> to hear the pronunciation.

---

## Essentials

| Situation | Chinese | Pinyin | Sounds like |
|-----------|---------|--------|-------------|
| Thank you | 谢谢 <button class="sp" onclick="speak('谢谢')">🔊</button> | Xiè xiè | "Shyeh shyeh" |
| Hello | 你好 <button class="sp" onclick="speak('你好')">🔊</button> | Nǐ hǎo | "Nee how" |
| Excuse me / Sorry | 不好意思 <button class="sp" onclick="speak('不好意思')">🔊</button> | Bù hǎo yì si | "Boo how ee suh" |
| Yes / Correct | 对 <button class="sp" onclick="speak('对')">🔊</button> | Duì | "Dway" |
| No / Not right | 不对 <button class="sp" onclick="speak('不对')">🔊</button> | Bù duì | "Boo dway" |
| I don't understand | 我听不懂 <button class="sp" onclick="speak('我听不懂')">🔊</button> | Wǒ tīng bù dǒng | "Woh ting boo dong" |
| Do you speak English? | 你会说英语吗？ <button class="sp" onclick="speak('你会说英语吗')">🔊</button> | Nǐ huì shuō Yīngyǔ ma? | "Nee hway shwoh Ying-yü ma" |
| Please speak slowly | 请说慢一点 <button class="sp" onclick="speak('请说慢一点')">🔊</button> | Qǐng shuō màn yīdiǎn | "Ching shwoh man ee-dyen" |

---

## At the Hotel

| Situation | Chinese | Pinyin |
|-----------|---------|--------|
| I have a reservation | 我有预订 <button class="sp" onclick="speak('我有预订')">🔊</button> | Wǒ yǒu yùdìng |
| My passport | 我的护照 <button class="sp" onclick="speak('我的护照')">🔊</button> | Wǒ de hùzhào |
| Where is the room? | 房间在哪里？ <button class="sp" onclick="speak('房间在哪里')">🔊</button> | Fángjiān zài nǎlǐ? |
| Hot water doesn't work | 热水没有 <button class="sp" onclick="speak('热水没有')">🔊</button> | Rè shuǐ méiyǒu |
| WiFi password? | WiFi密码是什么？ <button class="sp" onclick="speak('WiFi密码是什么')">🔊</button> | WiFi mìmǎ shì shénme? |

---

## Ordering Food

| Situation | Chinese | Pinyin |
|-----------|---------|--------|
| One portion of this (point at menu) | 这个一份 <button class="sp" onclick="speak('这个一份')">🔊</button> | Zhège yī fèn |
| This is delicious | 很好吃 <button class="sp" onclick="speak('很好吃')">🔊</button> | Hěn hǎo chī |
| Too spicy | 太辣了 <button class="sp" onclick="speak('太辣了')">🔊</button> | Tài là le |
| No coriander (cilantro) | 不要香菜 <button class="sp" onclick="speak('不要香菜')">🔊</button> | Bù yào xiāngcài |
| Water / Cold water | 水 / 凉水 <button class="sp" onclick="speak('凉水')">🔊</button> | Shuǐ / Liáng shuǐ |
| Beer | 啤酒 <button class="sp" onclick="speak('啤酒')">🔊</button> | Píjiǔ |
| The bill please | 买单 <button class="sp" onclick="speak('买单')">🔊</button> | Mǎi dān |
| How much? | 多少钱？ <button class="sp" onclick="speak('多少钱')">🔊</button> | Duōshǎo qián? |

---

## At Scenic Areas

| Situation | Chinese | Pinyin |
|-----------|---------|--------|
| Where is the toilet? | 厕所在哪里？ <button class="sp" onclick="speak('厕所在哪里')">🔊</button> | Cèsuǒ zài nǎlǐ? |
| Can I take a photo? | 可以拍照吗？ <button class="sp" onclick="speak('可以拍照吗')">🔊</button> | Kěyǐ pāizhào ma? |
| How far is it? | 还有多远？ <button class="sp" onclick="speak('还有多远')">🔊</button> | Hái yǒu duō yuǎn? |
| Is this the right way to...? | 去...是这条路吗？ <button class="sp" onclick="speak('去这里是这条路吗')">🔊</button> | Qù... shì zhè tiáo lù ma? |
| Ticket office | 售票处 <button class="sp" onclick="speak('售票处')">🔊</button> | Shòupiào chù |

---

## Emergency

| Situation | Chinese | Pinyin |
|-----------|---------|--------|
| Call an ambulance | 叫救护车 <button class="sp" onclick="speak('叫救护车')">🔊</button> | Jiào jiùhù chē |
| I need a doctor | 我需要医生 <button class="sp" onclick="speak('我需要医生')">🔊</button> | Wǒ xūyào yīshēng |
| Police | 警察 <button class="sp" onclick="speak('警察')">🔊</button> | Jǐngchá |
| Hospital | 医院 <button class="sp" onclick="speak('医院')">🔊</button> | Yīyuàn |
| I am allergic to... | 我对...过敏 <button class="sp" onclick="speak('我对这个过敏')">🔊</button> | Wǒ duì... guòmǐn |
| Emergency number | **120** (ambulance) · **110** (police) | |

---

## Transport & Navigation

| Situation | Chinese | Pinyin |
|-----------|---------|--------|
| Train station | 火车站 <button class="sp" onclick="speak('火车站')">🔊</button> | Huǒchē zhàn |
| Where is the platform? | 站台在哪里？ <button class="sp" onclick="speak('站台在哪里')">🔊</button> | Zhàntái zài nǎlǐ? |
| Xi'an North Station | 西安北站 <button class="sp" onclick="speak('西安北站')">🔊</button> | Xī'ān Běi zhàn |
| I want to go to... | 我要去... <button class="sp" onclick="speak('我要去')">🔊</button> | Wǒ yào qù... |
| Call a taxi (Didi) | 叫车 <button class="sp" onclick="speak('叫车')">🔊</button> | Jiào chē |
| Stop here please | 在这里停 <button class="sp" onclick="speak('在这里停')">🔊</button> | Zài zhèlǐ tíng |
| How long does it take? | 要多长时间？ <button class="sp" onclick="speak('要多长时间')">🔊</button> | Yào duō cháng shíjiān? |
| Left / Right / Straight | 左 / 右 / 直走 <button class="sp" onclick="speak('左，右，直走')">🔊</button> | Zuǒ / Yòu / Zhí zǒu |

---

## Shopping & Bargaining

| Situation | Chinese | Pinyin |
|-----------|---------|--------|
| Too expensive | 太贵了 <button class="sp" onclick="speak('太贵了')">🔊</button> | Tài guì le |
| Can it be cheaper? | 可以便宜一点吗？ <button class="sp" onclick="speak('可以便宜一点吗')">🔊</button> | Kěyǐ piányi yīdiǎn ma? |
| I don't want it | 我不要 <button class="sp" onclick="speak('我不要')">🔊</button> | Wǒ bù yào |
| I'll take this one | 我要这个 <button class="sp" onclick="speak('我要这个')">🔊</button> | Wǒ yào zhège |
| Can I pay with WeChat? | 可以微信支付吗？ <button class="sp" onclick="speak('可以微信支付吗')">🔊</button> | Kěyǐ Wēixìn zhīfù ma? |
| Cash | 现金 <button class="sp" onclick="speak('现金')">🔊</button> | Xiànjīn |

---

## Numbers (for prices, quantities)

| Number | Chinese | Pinyin |
|--------|---------|--------|
| 1 | 一 <button class="sp" onclick="speak('一')">🔊</button> | yī |
| 2 | 二 / 两 <button class="sp" onclick="speak('二')">🔊</button> | èr / liǎng |
| 5 | 五 <button class="sp" onclick="speak('五')">🔊</button> | wǔ |
| 10 | 十 <button class="sp" onclick="speak('十')">🔊</button> | shí |
| 100 | 一百 <button class="sp" onclick="speak('一百')">🔊</button> | yī bǎi |
| How many people: 8 | 八个人 <button class="sp" onclick="speak('八个人')">🔊</button> | bā gè rén |

---

## Food Glossary for the Route

### Beijing

| Item | Chinese | What it is |
|------|---------|------------|
| 北京烤鸭 <button class="sp" onclick="speak('北京烤鸭')">🔊</button> | Běijīng kǎoyā | Peking roast duck — the iconic Beijing dish |
| 火锅 <button class="sp" onclick="speak('火锅')">🔊</button> | Huǒguō | Hotpot — cook raw ingredients in boiling broth at the table |
| 炸酱面 <button class="sp" onclick="speak('炸酱面')">🔊</button> | Zhájiàng miàn | Noodles with thick soybean paste sauce |
| 卤煮 <button class="sp" onclick="speak('卤煮')">🔊</button> | Lǔzhǔ | Stewed offal in broth — local street snack, not for everyone |
| 豆汁 <button class="sp" onclick="speak('豆汁')">🔊</button> | Dòuzhī | Fermented mung bean drink — an acquired taste |

### Xi'an

| Item | Chinese | What it is |
|------|---------|------------|
| 肉夹馍 <button class="sp" onclick="speak('肉夹馍')">🔊</button> | Ròu jiā mó | Minced meat in crispy flatbread — "Chinese hamburger" |
| 羊肉泡馍 <button class="sp" onclick="speak('羊肉泡馍')">🔊</button> | Yángròu pàomó | Crumbled flatbread soaked in rich lamb broth — Xi'an's signature |
| 胡辣汤 <button class="sp" onclick="speak('胡辣汤')">🔊</button> | Húlàtāng | Spicy pepper soup — the local breakfast combo with ròujiāmó |
| 凉皮 <button class="sp" onclick="speak('凉皮')">🔊</button> | Liáng pí | Cold wheat noodles with chili oil — essential summer food |
| 石榴汁 <button class="sp" onclick="speak('石榴汁')">🔊</button> | Shíliú zhī | Fresh pomegranate juice — pressed at stalls in the Muslim Quarter |
| 镜糕 <button class="sp" onclick="speak('镜糕')">🔊</button> | Jìnggāo | Mini steamed rice cakes with various toppings |
| 烤羊肉串 <button class="sp" onclick="speak('烤羊肉串')">🔊</button> | Kǎo yángròu chuàn | Cumin lamb skewers — grilled over charcoal in the Muslim Quarter |
| 酸梅汤 <button class="sp" onclick="speak('酸梅汤')">🔊</button> | Suānméi tāng | Sour plum drink — refreshing in summer heat |

### Northwest Road Trip

| Item | Chinese | What it is |
|------|---------|------------|
| 拉条子 <button class="sp" onclick="speak('拉条子')">🔊</button> | Lā tiáo zi | Hand-pulled noodles with lamb sauce — Dunhuang staple |
| 手抓羊肉 <button class="sp" onclick="speak('手抓羊肉')">🔊</button> | Shǒu zhuā yángròu | Hand-grabbed lamb, boiled, eaten with hands |
| 酸奶 <button class="sp" onclick="speak('酸奶')">🔊</button> | Suānnǎi | Yogurt — local Tibetan-style in Qilian is excellent |
| 涮羊肉 <button class="sp" onclick="speak('涮羊肉')">🔊</button> | Shuàn yángròu | Lamb hotpot |
| 烤馕 <button class="sp" onclick="speak('烤馕')">🔊</button> | Kǎo náng | Baked flatbread — Silk Road staple |
| 哈密瓜 <button class="sp" onclick="speak('哈密瓜')">🔊</button> | Hāmì guā | Hami melon — sweet, from Xinjiang, sold everywhere |
| 牦牛酸奶 <button class="sp" onclick="speak('牦牛酸奶')">🔊</button> | Máoniú suānnǎi | Yak yogurt — thick, tangy, found in Qinghai |
| 青稞酒 <button class="sp" onclick="speak('青稞酒')">🔊</button> | Qīngkē jiǔ | Highland barley wine — local Tibetan alcohol, strong |
