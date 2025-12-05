
import 'dotenv/config';
import { storage } from '../server/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importFooterTranslations() {
    console.log('Starting footer translation import...');

    try {
        // Read the updated es.json file
        const esPath = path.join(__dirname, '../translations/es.json');
        const esContent = fs.readFileSync(esPath, 'utf-8');
        const esTranslations = JSON.parse(esContent);

        // Filter for the new footer keys we added
        const newKeys = [
            "landing.footer.description",
            "landing.footer.product",
            "landing.footer.company",
            "landing.footer.support",
            "landing.footer.features",
            "landing.footer.pricing",
            "landing.footer.integrations",
            "landing.footer.api",
            "landing.footer.about",
            "landing.footer.blog",
            "landing.footer.careers",
            "landing.footer.contact",
            "landing.footer.help_center",
            "landing.footer.documentation",
            "landing.footer.status",
            "landing.footer.privacy_policy",
            "landing.footer.terms_of_service",
            "landing.footer.cookie_policy",
            "landing.footer.all_rights_reserved"
        ];

        const translationsToImport = esTranslations.filter((t: any) => newKeys.includes(t.key));

        console.log(`Found ${translationsToImport.length} new footer translations to import.`);

        // Import into database
        // We use 'es' as language code and 'translation' as default namespace
        await storage.importTranslations('es', 'translation', translationsToImport);

        console.log('Successfully imported footer translations!');
    } catch (error) {
        console.error('Error importing translations:', error);
        process.exit(1);
    }
}

importFooterTranslations();
