import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import stringSimilarity from "string-similarity";

import dotenv from "dotenv";
import fetchData from "./database.js";

dotenv.config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.TOKEN_BOT;

async function main() {
  try {
    const data = await fetchData; // Make sure to call the fetchData function
    bot.data = data; // Store the data in the bot for later use
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();

bot.login(token);

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);

  bot.user.setPresence({
    activities: [{ name: "-infos pour toutes les infos du bot" }],
    status: "online",
  });
});

bot.on("messageCreate", (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  // Define the command prefix
  const prefix = "-"; // Customize this to your preference

  if (message.content.startsWith(prefix)) {
    // Remove the prefix from the message content and split the message into parts
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(`Commande ${command} exécutée par ${message.author.tag}`);
    if (command === "i") {
      const itemName = args.join(" ");
      const data = bot.data; // Retrieve the data from the bot

      function findBestMatch(itemName) {
        const itemNameLower = itemName.toLowerCase();
        let bestMatch = null;
        let bestMatchScore = 0; // Declare bestMatchScore in this scope

        for (const item of data) {
          const itemNameLowercase = item.Name.toLowerCase();
          const similarity = stringSimilarity.compareTwoStrings(
            itemNameLower,
            itemNameLowercase
          );

          if (similarity > bestMatchScore) {
            bestMatch = item;
            bestMatchScore = similarity;
          }
        }

        return { bestMatch, bestMatchScore }; // Return both bestMatch and bestMatchScore
      }

      const { bestMatch, bestMatchScore } = findBestMatch(itemName); // Destructure the returned object

      if (bestMatch && bestMatchScore > 0.3) {
        // Use bestMatch and bestMatchScore here
        // Use regular expression to split the text into an array of items
        const Characteristics = bestMatch.Characteristics.split(/ (?=\d|[-])/);

        // Create a bullet list
        const FormatedCharacteristics = Characteristics.map(
          (Characteristic) => `• ${Characteristic}`
        ).join("\n");

        const rarityMap = {
          0: "Commun",
          1: "Inhabituel",
          2: "Rare",
          3: "Mythique",
          4: "Légendaire",
          5: "Relique",
          6: "Épique",
        };

        // Convert the rarity number to its string representation
        const rarityString = rarityMap[bestMatch.Rarity] || "Unknown";

        const description = `**Level:** ${bestMatch.Level}\n**Type:** ${bestMatch.Type}\n**Rareté:** ${rarityString}\n\n**Caractéristiques:**\n\n ${FormatedCharacteristics}`;

        const embed = new EmbedBuilder()
          .setTitle(bestMatch.Name)
          .setURL(
            `https://www.wakfu.com/fr/mmorpg/encyclopedie/armures/${bestMatch.ID_item}`
          )
          .setImage(
            `https://static.ankama.com/wakfu/portal/game/item/115/${bestMatch.Image}.png`
          )
          .setDescription(description)
          .setColor("#00ff00");

        message.reply({ embeds: [embed] });
        console.log(`Best match score: ${bestMatchScore}`);
      } else {
        message.reply("No result found.");
      }
    } else if (command === "infos") {
      // Créer un message intégré pour afficher les informations sur le bot
      const embed = new EmbedBuilder()
        .setTitle("Informations sur le Bot")
        .setDescription("Ce bot fournit des informations sur les objets du jeu Wakfu.")
        .addFields(
          { name: "Préfixe", value: prefix, inline: true },
          { name: "Commande pour les informations sur les objets", value: `${prefix}i <nom de l'objet>`, inline: true },
          { name: "Serveur Discord de support", value: "[Cliquez ici](https://discord.gg/FQPByfh4c2)", inline: true },
        )
        .setColor("#00ff00");

      message.channel.send({ embeds: [embed] });
      console.log(`Commande infos exécutée`);
    }
    
  }
});
