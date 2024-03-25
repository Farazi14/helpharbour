using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;


namespace helpharbour.Model
        
{
    [BsonIgnoreExtraElements]
    public class Approval
    {

        [BsonElement("approvalID")]
        public int approvalID { get; set; }

        [BsonElement("approver")]
        public string approver { get; set; }

        [BsonElement("ticketID")]
        public int ticketID { get; set; }


    }
}
