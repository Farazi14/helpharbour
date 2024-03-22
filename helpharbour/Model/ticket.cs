using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]
    public class ticket
    {
        [BsonElement("ticketID")]
        public int ticketID { get; set; }

        [BsonElement("type")]
        public string type { get; set; }

        [BsonElement("title")]
        public string title { get; set; }

        [BsonElement("description")]
        public string description { get; set; }

        [BsonElement("SLA_Expiry")]
        public string SLA_Expiry { get; set; }

        [BsonElement("urgency")]
        public string urgency { get; set; }

        [BsonElement("Requestor")]
        public string Requestor { get; set; }

        [BsonElement("status")]
        public string status { get; set; }

        [BsonElement("assigned")]
        public string assigned { get; set; }

        [BsonElement("createdDate")]
        public string createdDate { get; set; }
  

    }
}
