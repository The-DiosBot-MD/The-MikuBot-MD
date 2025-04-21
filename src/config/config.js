import dotenv from 'dotenv'
dotenv.config()

export const config = {
    tokens: {
        telegram: process.env.TELEGRAM_BOT_TOKEN,
        discord: process.env.DISCORD_BOT_TOKEN,
    },
    credentials: {
        instagram: {
            username: process.env.INSTAGRAM_USERNAME,
            password: process.env.INSTAGRAM_PASSWORD,
        },
        messenger: {
            accessToken: process.env.MESSENGER_BOT_TOKEN,
        },
        threads: {
            username: process.env.THREADS_USERNAME,
            password: process.env.THREADS_PASSWORD,
        },
    },
};
