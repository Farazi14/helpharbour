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

        // method to get a comment by ID
        public Comment GetCommentById(int commentId)
        {
            return comment_Collection.Find<Comment>(comment => comment.commentID == commentId).FirstOrDefault();
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

            comment_Collection.InsertOne(newcomment);
            return newcomment;
        }

        // method to update a comment
        public void UpdateComment(int commentID, Comment comment)
        {
            comment_Collection.ReplaceOne(c => c.commentID == commentID, comment);
        }

        // method to delete a comment
        public void DeleteComment(int commentID)
        {
            comment_Collection.DeleteOne(comment => comment.commentID == commentID);
        }

    }
}
