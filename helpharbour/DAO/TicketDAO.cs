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
            var filter = Builders<ticket>.Filter.Eq(t => t.ticketID, ticketId);
            var update = Builders<ticket>.Update;  //defining the update builder
            // defining the list of updates
            List<UpdateDefinition<ticket>> updates = new List<UpdateDefinition<ticket>>(); // defining the list of updates

            if (!string.IsNullOrEmpty(updatedTicket.status)) // check if the status is not null, if not null then update the status
            {
                updates.Add(update.Set(t => t.status, updatedTicket.status));
            }

            if (!string.IsNullOrEmpty(updatedTicket.assigned)) // check if the assigned user is not null, if not null then update the assigned user
            {
                updates.Add(update.Set(t => t.assigned, updatedTicket.assigned));
            }

            var combinedUpdate = update.Combine(updates);  // combine the updates so that we can be updated in a single query
            var options = new FindOneAndUpdateOptions<ticket>
            {
                ReturnDocument = ReturnDocument.After
            };
                        
            var result = ticket_Collection.FindOneAndUpdate(filter, combinedUpdate, options); // update the ticket and store the updated ticket in result

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

        //method to get tickets assigned to a user
        public List<ticket> GetTicketsByAssignee(string userId)
        {
            return ticket_Collection.Find(ticket => ticket.assigned == userId).ToList();
        }

        //get statuses of tickets
        public List<string> GetAllStatuses()
        {
            return ticket_Collection.AsQueryable()     // get all the tickets using AsQueryable function
                                    .Select(ticket => ticket.status)  // select the status of each ticket
                                    .Distinct()  // get the distinct statuses to remove duplicates
                                    .ToList();  // return the list of statuses
        }

        //get all tickets by status
        public List<ticket> GetTicketsByStatus(string status)
        {
            return ticket_Collection.Find(ticket => ticket.status == status).ToList(); // get all the tickets with the given status
        }
    }
}
