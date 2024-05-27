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
               
        // method to add a comment
        public Comment AddComment(Comment newcomment)
        {
            var largestCommentID = comment_Collection
                              .Find(comment => true)
                              .SortByDescending(comment => comment.commentID)
                              .Limit(1)
                              .FirstOrDefault()?.commentID ?? 0;

            newcomment.commentID = largestCommentID + 1;
            newcomment.timestamp = DateTime.Now;

            comment_Collection.InsertOne(newcomment);
            return newcomment;
        }

       
        // fetch all comments for a ticket by ticketID
        public List<Comment> GetCommentsByTicketID(int ticketID)
        {
            return comment_Collection.Find<Comment>(comment => comment.ticketID == ticketID).ToList();
        }


    }
}
