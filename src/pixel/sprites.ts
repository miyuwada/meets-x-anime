// ドット絵の素材（1文字=1ドット、'.'=透明）。色は Sprite.tsx の BASE と各 palette で決まる
// H=髪, h=髪ハイライト, B=服, b=服の影, L=スカート/ズボン

// 企画担当の女の子（16x22）
const girlTop = [
  "....KKKKKKKK....",
  "...KHHHHHHHHK...",
  "..KHHhhHHHHHHK..",
  "..KHHHHHHHHHHK..",
  ".KHHSHHSSHHSHHK.",
  ".KHSSSSSSSSSSHK.",
];
const girlBottom = [
  "..KHKSSSSSSKHK..",
  "..KH.KKSSKK.HK..",
  "....KWBBBBWK....",
  "...KBBWRRWBBK...",
  "..KSBBBBBBBBSK..",
  "..KSBbBBBBbBSK..",
  "..KKBBBBBBBBKK..",
  "....KLLLLLLK....",
  "...KLLLLLLLLK...",
  "....KSK..KSK....",
  "....KKK..KKK....",
];
export const GIRL = {
  normal: [
    ...girlTop,
    ".KHSKKSSSSKKSHK.",
    ".KHSEWSSSSEWSHK.",
    ".KHSEESSSSEESHK.",
    ".KHCSSSSSSSSCHK.",
    "..KHSSSRRSSSHK..",
    ...girlBottom,
  ],
  worried: [
    ...girlTop,
    ".KHSSKSSSSKSSHK.",
    ".KHSEWSSSSEWSHK.",
    ".KHSEESSSSEESHK.",
    ".KHSSSSSSSSSSHK.",
    "..KHSSKSKSSSHK..",
    ...girlBottom,
  ],
  happy: [
    ...girlTop,
    ".KHSSKSSSSKSSHK.",
    ".KHSKSKSSKSKSHK.",
    ".KHSSSSSSSSSSHK.",
    ".KHCSSSSSSSSCHK.",
    "..KHSSRRRRSSHK..",
    ...girlBottom,
  ],
};

// AIロボット（16x18）
const robotTop = [
  ".......GG.......",
  ".......KK.......",
  "....KKKKKKKK....",
  "...KWWWWWWWWK...",
  ".KKWNNNNNNNNWKK.",
  ".KcWNNNNNNNNWcK.",
];
const robotBottom = [
  ".KKWNNNNNNNNWKK.",
  "...KWWWWWWWWK...",
  "....KKKKKKKK....",
  "...KWWWWWWWWK...",
  "..KWWWAAAAWWWK..",
  "..KWWWAWWAWWWK..",
  "..KWWWAAAAWWWK..",
  "...KWWWWWWWWK...",
  "....KK....KK....",
];
export const ROBOT = {
  happy: [...robotTop, ".KcWNcNNNNcNWcK.", ".KKWcNcNNcNcWKK.", "..KWNNNccNNNWK..", ...robotBottom],
  scan: [...robotTop, ".KcWNccNNccNWcK.", ".KKWNccNNccNWKK.", "..KWNNNNNNNNWK..", ...robotBottom],
};

// 通行人（8x12）。歩きは2コマ
const walkerTop = ["..KKKK..", ".KHHHHK.", ".KSSSSK.", ".KSESEK.", ".KSSSSK.", "..KKKK..", ".KBBBBK.", "KSBBBBSK", ".KBBBBK."];
export const WALKER = [
  [...walkerTop, ".KLLLLK.", ".KL..LK.", ".KK..KK."],
  [...walkerTop, ".KLLLLK.", "..KLLK..", "..KKKK.."],
];

// スマホ（6x9）
export const PHONE = ["KKKKKK", "KccccK", "KcWccK", "KccccK", "KccccK", "KccccK", "KccccK", "KKWWKK", "KKKKKK"];

// 段ボール（10x8）
export const BOX = [
  "KKKKKKKKKK",
  "KOOOTTOOOK",
  "KOOOTTOOOK",
  "KooooooooK",
  "KOOOOOOOOK",
  "KOOOOOOOOK",
  "KOOOOOOOOK",
  "KKKKKKKKKK",
];

// サイコロ（8x8）
export const DICE = ["KKKKKKKK", "KWWWWWWK", "KWEWWWWK", "KWWWWWWK", "KWWWWWWK", "KWWWWEWK", "KWWWWWWK", "KKKKKKKK"];

// 服アイコン（10x9）
export const SHIRT = [
  ".KKK..KKK.",
  "KBBBKKBBBK",
  "KBBBBBBBBK",
  ".KKBBBBKK.",
  "..KBBBBK..",
  "..KBbBBK..",
  "..KBBBBK..",
  "..KBBbBK..",
  "..KKKKKK..",
];

// ハート（7x6）・星（7x7）
export const HEART = [".KK.KK.", "KRRKRRK", "KRRRRRK", ".KRRRK.", "..KRK..", "...K..."];
export const STAR = ["...G...", "...G...", "..GGG..", "GGGGGGG", "..GGG..", ".GG.GG.", "G.....G"];

// 工場（16x12）
export const FACTORY = [
  "..KK............",
  "..KgK...........",
  "..KgK...........",
  "..KgK..K...K....",
  "..KgK.KgK.KgK...",
  "KKKKKKggKKggKKKK",
  "KggggggggggggggK",
  "KgWWgWWgWWgWWggK",
  "KgWWgWWgWWgWWggK",
  "KggggggggggKKKgK",
  "KggggggggggKOKgK",
  "KKKKKKKKKKKKKKKK",
];
