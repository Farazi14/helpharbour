using MongoDB.Bson.Serialization.Attributes;

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]
    public class Comment
    {

        [BsonElement("commentID")]
        public int commentID { get; set; }

        [BsonElement("ticketID")]
        public int ticketID { get; set; }

        [BsonElement("message")]
        public string message { get; set; }

        [BsonElement("timestamp")]
        public int timestamp { get; set; }

       
    }
}
