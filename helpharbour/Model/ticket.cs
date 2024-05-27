using MongoDB.Bson;                                 // MongoDB types for BsonDocument
using MongoDB.Bson.Serialization.Attributes;        // MongoDB serialization attributes for the class properties

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]                       // Ignore extra elements in the database
    public class ticket
    {
        // MongoDB element name in the database and their mapping to the class properties
        [BsonElement("ticketID")]
        public int ticketID { get; set; }

        [BsonElement("type")]
        public string type { get; set; }

        [BsonElement("title")]
        public string title { get; set; }

        [BsonElement("description")]
        public string description { get; set; }

        [BsonElement("urgency")]
        public string urgency { get; set; }

        [BsonElement("Requestor")]
        public string Requestor { get; set; }

        [BsonElement("status")]
        public string status { get; set; }

        [BsonElement("assigned")]
        public string assigned { get; set; }

        [BsonElement("createdDate")]
        public DateTime createdDate { get; set; }

        [BsonElement("slA_Expiry")]
        public DateTime slA_Expiry { get; set; }

    }
}
