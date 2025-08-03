import nodeCron from "node-cron";
import Debt from "./models-orm-sequelize/Debt.js";

const schedule = nodeCron.schedule("0 0 * * *", async () => {
    try {
        console.log('Running daily debt status update...');
        await Debt.updateAllDebtStatus();
        console.log('Daily debt status update completed successfully');
    } catch (error) {
        console.error('Error in daily debt status update:', error);
    }
}, {
    scheduled: false, 
    timezone: "UTC" 
});

export default schedule;