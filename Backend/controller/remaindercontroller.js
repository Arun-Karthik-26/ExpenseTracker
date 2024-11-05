import Reminder from '../models/remainder.js';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';

// Function to send email notification
const sendEmail = async (reminder) => {

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 465 for SSL
    secure: true, // Set to true for 465
    auth: {
        user: process.env.USER, // Your Gmail address
        pass: process.env.PASS, // Your Gmail app password (not your email password if 2FA is enabled)
    },
    tls: {
        rejectUnauthorized: false, // Optional: Bypass unauthorized certificate checks
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
export const addReminder = async (req, res) => {
    const { userId, name, amount, lastDate, userEmail } = req.body;

    if (!userId || !name || !amount || !lastDate || !userEmail) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const reminder = await Reminder.create({ userId, name, amount, lastDate, userEmail });
        // Schedule the email notification for 2 days before the last date
        const twoDaysBefore = new Date(lastDate);
        twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
        // Schedule the job
        console.log(`Job scheduled for: ${twoDaysBefore}`);
        schedule.scheduleJob(twoDaysBefore, async function () {
            console.log("Executing scheduled job...");
            await sendEmail(reminder);
        });

        res.status(201).json(reminder);
    } catch (error) {
        console.error("Error adding reminder:", error);
        res.status(500).json({ message: "Error creating reminder", error });
    }
};
