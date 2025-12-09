export const SENTANCE_BANKS = {
    easy: [
        "The sun is shining bright today.",
        "I love to play games with my friends.",
        "Cats and dogs are cute animals.",
        "We walked to the park nearby.",
        "She reads a book every night.",
        "Blue is my favorite color.",
        "He runs very fast in the morning.",
        "Apples are red and tasty.",
        "The sky is clear and blue.",
        "I can type very fast now.",
        "Summer days are long and warm.",
        "My car is parked outside.",
        "Birds sing songs in the trees.",
        "The water in the lake is cold.",
        "We are going to the zoo.",
        "It is fun to cook dinner.",
        "Music makes me feel happy.",
        "The moon shines at night.",
        "I have a big red ball.",
        "Time flies when you have fun."
    ],
    medium: [
        "The quick brown fox jumps over the lazy dog.",
        "Technology is changing the way we live and work.",
        "It's important to get enough sleep each night.",
        "The journey of a thousand miles begins with a single step.",
        "Reading improves your vocabulary and imagination.",
        "Don't count your chickens before they hatch.",
        "Creative thinking leads to innovation and progress.",
        "The weather forecast predicts rain later this afternoon.",
        "Consistency is the key to mastering any new skill.",
        "Communication is vital for building strong relationships.",
        "Exploring nature helps to reduce stress and anxiety.",
        "Music has the power to connect people from all cultures.",
        "Always try to see the bright side of things.",
        "Learning a new language opens up many focused opportunities.",
        "Healthy eating habits contribute to a longer life.",
        "Problem solving is a crucial soft skill in the workplace.",
        "The stars twinkle beautifully in the midnight sky.",
        "She decided to start a new hobby regarding painting.",
        "Efficient time management allows for more leisure activities.",
        "Kindness is a language that the deaf can hear."
    ],
    hard: [
        "To be, or not to be, that is the question: whether 'tis nobler in the mind to suffer.",
        "The only thing we have to fear is fear itself; nameless, unreasoning, unjustified terror.",
        "In the midst of chaos, there is also opportunity.",
        "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "It involves thinking about the fundamental nature of knowledge, reality, and existence.",
        "The industrial revolution marked a major turning point in history; almost every aspect of daily life was influenced.",
        "Artificial intelligence is leveraging computers and machines to mimic the problem-solving and decision-making capabilities of the human mind.",
        "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature.",
        "Sustainability focuses on meeting the needs of the present without compromising the ability of future generations to meet theirs.",
        "Cryptocurrency is a digital or virtual currency that is secured by cryptography, which makes it nearly impossible to counterfeit.",
        "The concept of the 'uncanny valley' suggests that humanoid objects which appear almost, but not exactly, like real human beings elicit feelings of eeriness.",
        "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.",
        "Globalization describes the growing interdependence of the world's economies, cultures, and populations, brought about by cross-border trade.",
        "Neuroplasticity is the brain's ability to reorganize itself by forming new neural connections throughout life."
    ]
};

const getRandomSentence = (difficulty) => {
    const bank = SENTANCE_BANKS[difficulty] || SENTANCE_BANKS.medium;
    return bank[Math.floor(Math.random() * bank.length)];
};

export const generateFluentText = (difficulty = 'medium', minWords = 50) => {
    let text = [];
    let wordCount = 0;

    while (wordCount < minWords) {
        const sentence = getRandomSentence(difficulty);
        const words = sentence.split(' ');

        // Add words array
        text = [...text, ...words];
        wordCount += words.length;
    }

    return text;
};

// Keep backwards compatibility just in case, or for simple random modes later
export const getRandomWords = (difficulty, count) => generateFluentText(difficulty, count);
