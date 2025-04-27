const cron = require('node-cron');
const Order = require('./models/Order');  // Assuming the Order model is saved in 'models/Order.js'

// Job 1: Check for "Pending" orders and update to "Shipped" after 5 minutes
cron.schedule('*/5 * * * *', async () => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);  // 5 minutes ago
        const pendingOrders = await Order.find({
            orderStatus: 'Pending',
            createdAt: { $lte: fiveMinutesAgo },
        });

        if (pendingOrders.length > 0) {
            for (let order of pendingOrders) {
                order.orderStatus = 'Shipped';
                await order.save();
                console.log(`Order ${order._id} updated to Shipped.`);
            }
        }
    } catch (error) {
        console.error('Error updating pending orders:', error);
    }
});

// Job 2: Check for "Shipped" orders and update to "Delivered" after 2 hours
cron.schedule('*/5 * * * *', async () => {
    try {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);  // 2 hours ago
        const shippedOrders = await Order.find({
            orderStatus: 'Shipped',
            createdAt: { $lte: twoHoursAgo },
        });

        if (shippedOrders.length > 0) {
            for (let order of shippedOrders) {
                order.orderStatus = 'Delivered';
                await order.save();
                console.log(`Order ${order._id} updated to Delivered.`);
            }
        }
    } catch (error) {
        console.error('Error updating shipped orders:', error);
    }
});
