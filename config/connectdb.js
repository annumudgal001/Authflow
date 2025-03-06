import mongoose from 'mongoose';

const connectdb = async (DATABASE_URL) => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectdb;
