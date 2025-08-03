import Customer from "../models-orm-sequelize/Customer.js";

export class CustomerController {
    static async getMyCustomers(req, res) {
        try {
            const userId = req.user.id; // Use authenticated user's ID
            const customers = await Customer.findByUserId(userId);
            res.status(200).json(customers);
        } catch(err){
            res.status(500).json({
                error: err.message,
                message: "Error getting customers"
            });
        }
    }

    static async createCustomer(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id; // Use authenticated user's ID
            
            const customerObj = {
                userId: userId, // Secure - can't be manipulated
                name: data.name,
                citizenId: data.citizenId || "",
                email: data.email || "",
                phoneNumber: data.phone_number || "",
                address: data.address || "",
            }
            const result = await Customer.createCustomer(customerObj);
            if (!result) throw new Error('Can not create customer');
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({
                error: error.message,
                message: "Error creating customer"
            });
        }
    }

    static async updateCustomer(req, res) {
        try {
            const customerId = req.params.id;
            const userId = req.user.id; // Use authenticated user's ID
            
            // Verify ownership
            const customer = await Customer.findByPk(customerId);
            if (!customer || customer.userId !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            const data = req.body;
            const customerObj = {
                id: customerId,
                name: data.name,
                citizenId: data.citizenId || "",
                email: data.email || "",
                phoneNumber: data.phone_number || "",
                address: data.address || "",
            }
            
            const updatedCustomer = await Customer.updateInfo(customerObj);
            res.status(200).json(updatedCustomer);
        } catch(err) {
            res.status(500).json({
                error: err.message,
                message: "Error updating customer"
            });
        }
    }
}