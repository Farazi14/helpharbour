using helpharbour.Model;
using MongoDB.Driver;
using helpharbour.Services;

namespace helpharbour.DAO
{
      
    public class CommentDAO
    {
        // declaring the comment collection
        private IMongoCollection<Comment> comment_Collection;

        // defining the collection by connecting to the database
        public CommentDAO(MongoDBConnection mongoDbConnection)
        {
            comment_Collection = mongoDbConnection.GetDatabase().GetCollection<Comment>("comment");
        }

        // method to get all the comments
        public List<Comment> GetAllComments()
        {
            return comment_Collection.Find(comment => true).ToList();
        }

    }
}
