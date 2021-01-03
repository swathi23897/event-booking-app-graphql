
const Booking = require("../../models/bookings");
const { transformBooking,transformEvent } = require("./merge")

const Event = require("../../models/event");



module.exports = {
    // object which has all resolvers
   

    bookings: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated')
        }
        try {
            const bookings = await Booking.find({user:req.userId});
            return bookings.map(booking => {
               return transformBooking(booking)
            });
        } catch (err) {
            throw err;
        }
    },
    
   

    bookEvent: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated')
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
         return transformBooking(result)
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated!');
        }
        try {
            console.log("in back ");
          const booking = await Booking.findById(args.bookingId).populate('event');
          console.log(booking);
          const event = transformEvent(booking.event);
          console.log(event);
          await Booking.deleteOne({ _id: args.bookingId });
          return event;
        } catch (err) {
          throw err;
        }
      }
    };