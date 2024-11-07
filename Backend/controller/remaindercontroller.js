import Reminder from '../models/remainder.js';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';


const sendEmail = async (reminder) => {
    console.log("sending to ",reminder.userEmail);
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,  // Use 465 for SSL
        secure: true, // Set to true for SSL
        auth: {
            user: process.env.USER, // Your Gmail address
            pass: process.env.PASS, // Your Gmail app password
        },
    });    
    
        
    
        const mailOptions = {
            from: process.env.USER,
            to: reminder.userEmail, // Make sure to store and use the user's email in the reminder
            subject: 'Reminder: Upcoming Bill/EMI Due',
            text: `This is a reminder that your bill/EMI "${reminder.name}" of amount $${reminder.amount} is due on ${reminder.lastDate}.`,
        };
    
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

// Endpoint to create a new reminder
// Endpoint to create a new reminder
export const addReminder = async (req, res) => {
    const { userId, name, amount, lastDate, userEmail } = req.body;
    
    console.log("received");
    if (!userId || !name || !amount || !lastDate || !userEmail) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const reminder = await Reminder.create({ userId, name, amount, lastDate, userEmail });
        // Schedule the email notification for 5 minutes later (for testing)
        const fiveMinutesLater = new Date();
        fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 1);
        

        console.log("hii");
        console.log("heloo");
        console.log(`Job scheduled for: ${fiveMinutesLater}`);
        schedule.scheduleJob(fiveMinutesLater, async function () {
            console.log("Executing scheduled job...");
            await sendEmail(reminder);
        });

        res.status(201).json(reminder);
    } catch (error) {
        console.error("Error adding reminder:", error);
        res.status(500).json({ message: "Error creating reminder", error });
    }
};
