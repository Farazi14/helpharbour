using MongoDB.Bson;                                 // MongoDB types for BsonDocument
using MongoDB.Bson.Serialization.Attributes;        // MongoDB serialization attributes for the class properties

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]                       // Ignore extra elements in the database
    public class faq
    {
        // MongoDB element name in the database and their mapping to the class properties
        [BsonElement("articleID")]
        public int articleID { get; set; }

        [BsonElement("title")]
        public string title { get; set; }

        [BsonElement("content")]
        public string content { get; set; }


        [BsonElement("authorID")]
        public int authorID { get; set; }
    }
}
