const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const dbConnect = async () => {
    try {
        await mongoose
            .connect(process.env.MONGO_LOCAL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
    } catch (error) {
        console.log("DB connected is failed");
        throw new Error(error);

    }
}
// mongodb

module.exports = dbConnect;