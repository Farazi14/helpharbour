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

        // method to get a faq by ID
        public faq GetFaqById(int faqId)
        {
            return faq_Collection.Find<faq>(faq => faq.articleID == faqId).FirstOrDefault();
        }

        // method to add a faq
        public faq AddFaq(faq newfaq)
        {
            var largestFaqID = faq_Collection
                              .Find(faq => true)
                              .SortByDescending(faq => faq.articleID)
                              .Limit(1)
                              .FirstOrDefault()?.articleID ?? 0;

            newfaq.articleID = largestFaqID + 1;

            faq_Collection.InsertOne(newfaq);
            return newfaq;
        }

        // method to update a faq
        public void UpdateFaq(int faqID, faq faq)
        {
            faq_Collection.ReplaceOne(f => f.articleID == faqID, faq);
        }

        // method to delete a faq
        public void DeleteFaq(int faqID)
        {
            faq_Collection.DeleteOne(faq => faq.articleID == faqID);
        }

    }
}
