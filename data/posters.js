// Backdrop posters. id matches assets/posters/full/<id>.jpg
// Fill in artist / url as you find the credits.
window.POSTERS = [
  { id: "01", title: "India: archer goddess" },
  { id: "02", title: "Saraswati" },
  { id: "03", title: "Buddha in a suit" },
  { id: "04", title: "Durga on the lion" },
  { id: "05", title: "Putthalika: Nimmalakunta Leather Art" },
  { id: "06", title: "The Age of Immortals" },
  { id: "07", title: "Nari: Desi Drip" },
  { id: "08", title: "Vighnaharta" },
  { id: "09", title: "Papier Dolls: Odisha Craft" },
  { id: "10", title: "Heritage of India" },
  { id: "11", title: "Ardha Narishvara" },
  { id: "12", title: "Terracotta Craft" },
  { id: "13", title: "Bangalore: Asian Paints" },
  { id: "14", title: "Vasudev" },
].map((p) => ({ artist: "Artist credit coming soon", url: "", ...p }));

// Where each poster sits on the wall image (assets/wall/wall.jpg, 1615 x 1134): [id, x, y, w, h]
window.WALL = {
  width: 1615,
  height: 1134,
  slots: [
    // column 1
    ["08", 0, 0, 240, 335], ["04", 0, 347, 240, 373], ["02", 0, 728, 240, 406],
    // column 2
    ["12", 240, 0, 273, 140], ["03", 240, 142, 273, 340], ["05", 240, 485, 273, 382], ["09", 240, 870, 273, 264],
    // column 3
    ["01", 513, 0, 272, 268], ["06", 513, 268, 272, 407], ["11", 513, 677, 272, 457],
    // column 4
    ["10", 785, 0, 278, 120], ["14", 785, 122, 278, 368], ["13", 785, 490, 278, 348], ["07", 785, 840, 278, 294],
    // column 5
    ["03", 1063, 0, 273, 163], ["05", 1063, 165, 273, 385], ["09", 1063, 550, 273, 340], ["12", 1063, 892, 273, 242],
    // column 6
    ["11", 1336, 0, 279, 390], ["10", 1336, 393, 279, 360], ["06", 1336, 755, 279, 379],
  ],
};
