using helpharbour.Model;
using MongoDB.Driver;
using helpharbour.Services;

namespace helpharbour.DAO
{
    public class faqDAO
    {
        // declaring the faq collection
        private IMongoCollection<faq> faq_Collection;

        // defining the collection by connecting to the database
        public faqDAO(MongoDBConnection mongoDbConnection)
        {
            faq_Collection = mongoDbConnection.GetDatabase().GetCollection<faq>("faq");
        }

        // method to get all the faqs
        public List<faq> GetAllFaqs()
        {
            return faq_Collection.Find(faq => true).ToList();
        }
    }
}
