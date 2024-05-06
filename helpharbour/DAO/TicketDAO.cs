using helpharbour.Model;
using helpharbour.Services;
using MongoDB.Driver;
using System.Net.Sockets;

namespace helpharbour.DAO
{
    public class TicketDAO
    {
        // declaring the ticket collection
        private IMongoCollection<ticket> ticket_Collection;

        // defining the collection by connecting to the database
        public TicketDAO(MongoDBConnection mongoDbConnection)
        {
            ticket_Collection = mongoDbConnection.GetDatabase().GetCollection<ticket>("ticket");
        }

        // method to get all the tickets
        public List<ticket> GetAllTickets()
        {
            return ticket_Collection.Find(ticket => true).ToList();
        }

        // method to get a ticket by ID
        public ticket GetTicketById(int ticketId)
        {
            return ticket_Collection.Find(ticket => ticket.ticketID == ticketId).FirstOrDefault();
        }

        // method to add a ticket
        public ticket AddTicket(ticket newTicket)
        {
            // Implementation to define the highest ticketID
            var largestTicketID = ticket_Collection
                              .Find(ticket => true)
                              .SortByDescending(ticket => ticket.ticketID)
                              .Limit(1)
                              .FirstOrDefault()?.ticketID ?? 0;


            // Increment the ticketID to ensure uniqueness
            newTicket.ticketID = largestTicketID + 1;

            // defing creation date of the ticket
            newTicket.createdDate = DateTime.Now;

            //defining the SLA expiry date
            newTicket.slA_Expiry = DateTime.Now.AddDays(2);
            // Insert the new ticket
            ticket_Collection.InsertOne(newTicket);
            return newTicket;
        }

        // method to update a ticket changed to update ticket status only and return the updated ticket
        public ticket UpdateTicket(int ticketId, ticket updatedTicket)
        {
            var filter = Builders<ticket>.Filter.Eq(t => t.ticketID, ticketId); // Filter to find the ticket by ID
            var update = Builders<ticket>.Update.Set(t => t.status, updatedTicket.status); // Update only the status

            var options = new FindOneAndUpdateOptions<ticket>
            {
                ReturnDocument = ReturnDocument.After // Return the updated document
            };

            // Perform the update and return the updated document
            var result = ticket_Collection.FindOneAndUpdate(filter, update, options);
            return result;
        }

        // method to delete a ticket
        public void DeleteTicket(int ticketId)
        {
            ticket_Collection.DeleteOne(ticket => ticket.ticketID == ticketId);
        }

        // method to get all tickets by a user
        public List<ticket> GetTicketsByUserId(string userId)
        {
            return ticket_Collection.Find(ticket => ticket.Requestor == userId).ToList();
        }
    }
}
