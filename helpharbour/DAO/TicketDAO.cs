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
    }
}
