
const Event = require("../../models/event");
const { transformEvent } = require("./merge")
const User = require("../../models/user");

module.exports = {
    // object which has all resolvers
    events: async () => {
        try {
            console.log("insideppp")
            const events = await Event.find();
            return events.map((event) => {
                return transformEvent(event) //event.id- mongoose translate the mongo id into string
            })
        }
        catch (err) {
            throw err;
        }

    },


    createEvent: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated')
        }
        console.log(args);
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = transformEvent(result)
            console.log(createdEvent)
            const creator = await User.findById(req.userId)
            if (!creator) {
                throw new Error("User not found")
            }
            creator.createdEvents.push(event)
            await creator.save()

            return createdEvent;
        }

        catch (err) {
            throw err;
        }
    },





};
