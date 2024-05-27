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
            faq_Collection = mongoDbConnection.GetDatabase().GetCollection<faq>("faq");    // Get the faq collection from the database
        }

        // method to get all the faqs
        public List<faq> GetAllFaqs()
        {
            return faq_Collection.Find(faq => true).ToList();
        }

        
        // method to add a faq
        public faq AddFaq(faq newfaq)
        {
            var largestFaqID = faq_Collection                                               // Faq collection is queried to get the largest faqID
                              .Find(faq => true)                                            // Find all faqs
                              .SortByDescending(faq => faq.articleID)                       // Sort by faqID in descending order
                              .Limit(1)                                                     // Limit the result to 1
                              .FirstOrDefault()?.articleID ?? 0;                            // Get the first result or return 0 if no result is found

            newfaq.articleID = largestFaqID + 1;                                            // Increment the largest faqID by 1 to get the new faqID

            faq_Collection.InsertOne(newfaq);                                               // Insert the new faq into the collection
            return newfaq;
        }

        
        // method to delete a faq
        public void DeleteFaq(int faqID)
        {
            faq_Collection.DeleteOne(faq => faq.articleID == faqID);
        }

    }
}
