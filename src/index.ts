import { planAndExecute } from "./genkit/planAndExecute/flow";
import * as dotenv from 'dotenv';

const main = async () => {
    dotenv.config();
    
    await planAndExecute(); // Adds the plan-and-execute workflow
}

main().catch((err) => {
	console.error('Error occurred:', err);
	process.exit(1);
});