
import 'dotenv/config';
import { storage } from '../server/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importFeaturesTranslations() {
    console.log('Starting features translation import...');

    try {
        // Read the updated es.json file
        const esPath = path.join(__dirname, '../translations/es.json');
        const esContent = fs.readFileSync(esPath, 'utf-8');
        const esTranslations = JSON.parse(esContent);

        // Filter for the new keys we added
        const newKeys = [
            "landing.features.title",
            "landing.features.subtitle",
            "landing.features.multi_channel.title",
            "landing.features.multi_channel.description",
            "landing.features.ai_automation.title",
            "landing.features.ai_automation.description",
            "landing.features.team_collaboration.title",
            "landing.features.team_collaboration.description",
            "landing.features.flow_builder.title",
            "landing.features.flow_builder.description",
            "landing.features.analytics.title",
            "landing.features.analytics.description",
            "landing.features.security.title",
            "landing.features.security.description",
            "landing.social_proof.title",
            "landing.social_proof.subtitle",
            "landing.stats.active_users",
            "landing.stats.uptime",
            "landing.stats.messages_processed",
            "landing.stats.support"
        ];

        const translationsToImport = esTranslations.filter((t: any) => newKeys.includes(t.key));

        console.log(`Found ${translationsToImport.length} new translations to import.`);

        // Import into database
        // We use 'es' as language code and 'translation' as default namespace
        await storage.importTranslations('es', 'translation', translationsToImport);

        console.log('Successfully imported feature translations!');
    } catch (error) {
        console.error('Error importing translations:', error);
        process.exit(1);
    }
}

importFeaturesTranslations();
