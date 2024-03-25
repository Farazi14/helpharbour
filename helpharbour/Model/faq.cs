using MongoDB.Bson.Serialization.Attributes;

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]
    public class faq
    {
        [BsonElement("articleID")]
        public int approvalID { get; set; }

        [BsonElement("title")]
        public string title { get; set; }

        [BsonElement("content")]
        public string content { get; set; }


        [BsonElement("authorID")]
        public int authorID { get; set; }
    }
}
