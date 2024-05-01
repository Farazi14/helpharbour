using MongoDB.Bson.Serialization.Attributes;

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]
    public class Comment
    {

        [BsonElement("commentID")]
        public int commentID { get; set; }

        [BsonElement("message")]
        public string message { get; set; }


        [BsonElement("ticketID")]
        public int ticketID { get; set; }
        

        [BsonElement("timestamp")]
        public DateTime timestamp { get; set; }

        [BsonElement("userID")]
        public int userID { get; set; }   //defined userID in comment model as it was missing in the initial setup

    }
}
