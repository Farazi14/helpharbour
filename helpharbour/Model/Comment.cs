using MongoDB.Bson;                                 // MongoDB types for BsonDocument
using MongoDB.Bson.Serialization.Attributes;        // MongoDB serialization attributes for the class properties

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]                       // Ignore extra elements in the database
    public class Comment
    {
        // MongoDB element name in the database and their mapping to the class properties
        [BsonElement("commentID")]
        public int commentID { get; set; }

        [BsonElement("message")]
        public string message { get; set; }


        [BsonElement("ticketID")]
        public int ticketID { get; set; }
        

        [BsonElement("timestamp")]
        public DateTime timestamp { get; set; }

        [BsonElement("userID")]
        public int userID { get; set; }             //defined userID in comment model as it was missing in the initial setup

    }
}
