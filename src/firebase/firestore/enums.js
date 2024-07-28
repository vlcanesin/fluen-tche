class LanguageEnum {
    constructor() {
        // Define the enum values with numbers
        this.Languages = Object.freeze({
            ALEMAO: 1,
            ARABE: 2,
            BENGALI: 3,
            CHINES_MANDARIM: 4,
            ESPANHOL: 5,
            FRANCES: 6,
            HINDI: 7,
            INDONESIO: 8,
            INGLES: 9,
            ITALIANO: 10,
            JAPONES: 11,
            MARATI: 12,
            PORTUGUES: 13,
            RUSSO: 14,
            SUAILI: 15,
            TAMIL: 16,
            TELUGO: 17,
            TURCO: 18,
            URDU: 19
        });

        // Define the emojis for each language
        this.Emojis = Object.freeze({
            ALEMAO: "🇩🇪",
            ARABE: "🇸🇦",
            BENGALI: "🇧🇩",
            CHINES_MANDARIM: "🇨🇳",
            ESPANHOL: "🇪🇸",
            FRANCES: "🇫🇷",
            HINDI: "🇮🇳",
            INDONESIO: "🇮🇩",
            INGLES: "🇬🇧",
            ITALIANO: "🇮🇹",
            JAPONES: "🇯🇵",
            MARATI: "🇮🇳",
            PORTUGUES: "🇵🇹",
            RUSSO: "🇷🇺",
            SUAILI: "🇰🇪",
            TAMIL: "🇮🇳",
            TELUGO: "🇮🇳",
            TURCO: "🇹🇷",
            URDU: "🇵🇰"
        });

        // Create a reverse mapping from numbers to tags
        this.ReverseLanguages = Object.freeze(
            Object.fromEntries(Object.entries(this.Languages).map(([key, value]) => [value, key]))
        );

        // Create a mapping from numbers to emojis
        this.NumberToEmojis = Object.freeze(
            Object.fromEntries(Object.entries(this.Languages).map(([key, value]) => [value, this.Emojis[key]]))
        );
    }

    // Method to get the number for a language tag
    encode(tag) {
        return this.Languages[tag.toUpperCase().replace(" ", "_")] || null;
    }

    // Method to get the language tag for a number
    decode(number) {
        return this.ReverseLanguages[number] || null;
    }

    // Method to get the emoji for a language tag
    getEmoji(tag) {
        return this.Emojis[tag.toUpperCase().replace(" ", "_")] || null;
    }

    // Method to get the emoji for a number
    getEmojiByNumber(number) {
        return this.NumberToEmojis[number] || null;
    }
}

class QTypeEnum {
    constructor() {
        // Define the enum values with numbers
        this.Questions = Object.freeze({
            MULTIPLA_ESCOLHA: 1,
            ASSOCIACAO: 2,
            ESCRITA: 3
        });

        // Create a reverse mapping from numbers to tags
        this.ReverseQuestions = Object.freeze(
            Object.fromEntries(Object.entries(this.Questions).map(([key, value]) => [value, key]))
        );
    }

    // Method to get the number for a language tag
    encode(tag) {
        return this.Questions[tag.toUpperCase().replace(" ", "_")] || null;
    }

    // Method to get the language tag for a number
    decode(number) {
        return this.ReverseQuestions[number] || null;
    }
}

// Export the class instance
const languageEnum = new LanguageEnum();
const qtypeEnum = new QTypeEnum();
export { languageEnum, qtypeEnum };