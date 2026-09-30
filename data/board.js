// The board. Edit this file to add / move / remove cards, then commit.
//
// column: { id, emoji, label, tone, cards: [...] }
//   tone  → pill colour: mint | grey | pink | blue | lilac | green | dark
// card (every field optional except title):
//   title, text, image, imageAlt, link, tag: { label, tone }, checklist: [{ text, done }], badge (emoji)
//   link → makes the whole card open that URL in a new tab
window.BOARD = {
  title: "Padma Playground",
  subtitle: "A kanban board to keep track of personal projects",
  columns: [
    {
      id: "idea", emoji: "💡", label: "GREATEST IDEA OF MY LIFE", tone: "mint",
      cards: [
        {
          title: "Hear me out",
          image: "assets/cards/hear-me-out.jpg", imageAlt: "A man mid-explanation on a stage",
          tag: { label: "Due 2027", tone: "pink" },
        },
      ],
    },
    {
      id: "started", emoji: "🚀", label: "Started immediately", tone: "grey",
      cards: [
        {
          title: "Aries energy in the house",
          checklist: [
            { text: "This is what the internet era is all about" },
            { text: "can't believe we get to be alive in this era" },
            { text: "We are so back" },
          ],
        },
      ],
    },
    {
      id: "thought", emoji: "🧠", label: "Oh. This requires thought.", tone: "pink",
      cards: [
        { title: "Daily Gita" },
      ],
    },
    {
      id: "solved", emoji: "🔎", label: "Surely someone has solved this", tone: "blue",
      cards: [
        { title: "Page 3 of google not looking promising" },
        { title: "Pocket Calendar" },
        { image: "assets/cards/bed-soon.jpg", imageAlt: "Meme: I'll go to bed soon… why am I on Wikipedia reading about advanced nuclear theory?", bare: true },
      ],
    },
    {
      id: "easier", emoji: "🚩", label: "I thought this would be easier", tone: "lilac",
      cards: [
        { title: "Mudra Name" },
        { image: "assets/cards/not-easy.jpg", imageAlt: "Banner: We do this not because it is easy, but because we thought it would be easy", bare: true },
        { image: "assets/cards/this-is-fine.jpg", imageAlt: "The 'this is fine' dog sitting in a burning room", bare: true },
      ],
    },
    {
      id: "v1", emoji: "🎉", label: "V1 IS OUT! No Questions pls", tone: "green",
      cards: [
        { title: "please don't zoom in" },
        {
          title: "Padmashree.xyz",
          link: "https://padmashree.xyz",
          tag: { label: "Sept 30", tone: "pink" },
        },
      ],
    },
  ],

  // The "save for later" blog column (real posts come later).
  blog: {
    id: "blog", emoji: "🧘", label: "See you after my training arc.", tone: "dark",
    cards: [
      { title: "Its a Skill issue ... right .... right ? 😔" },
      {
        image: "assets/cards/rafiki.jpg",
        imageAlt: "Rafiki meditating: Sometimes it takes courage to let go of things you held on to for too long",
      },
    ],
  },

  links: {
    tools: { label: "Tools", href: "https://anishhegde.com/tools/" },
    twitter: { label: "Twitter", href: "https://x.com/PadmashreeSatya" },
  },
};
