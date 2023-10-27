import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

async function fetchData() {
  try {
    // Ouvrez une connexion à la base de données SQLite
    const db = await open({
      filename: 'Otomai.db', // Remplacez 'mydatabase.db' par le nom de votre fichier SQLite
      driver: sqlite3.Database,
    });

    // Exécutez une requête SQL pour sélectionner des données
    const rows = await db.all('SELECT * FROM armor');

    return rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    throw error;
  }
}

export default fetchData();
