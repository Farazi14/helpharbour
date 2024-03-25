using helpharbour.Model;
using MongoDB.Driver;
using helpharbour.Services;

namespace helpharbour.DAO
{
    public class ApprovalDAO
    {

        // declaring the approval collection
        private IMongoCollection<Approval> approval_Collection;

        // defining the collection by connecting to the database
        public ApprovalDAO(MongoDBConnection mongoDbConnection)
        {
            approval_Collection = mongoDbConnection.GetDatabase().GetCollection<Approval>("approval");
        }

        // method to get all the approvals
        public List<Approval> GetAllTickets()
        {
            return approval_Collection.Find(approval => true).ToList();
        }
    }
}
