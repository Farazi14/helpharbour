using MongoDB.Bson;                           // MongoDB types for BsonDocument
using MongoDB.Bson.Serialization.Attributes;  // MongoDB serialization attributes for the class properties 


namespace helpharbour.Model
        
{   
    [BsonIgnoreExtraElements]                 // Ignore extra elements in the database
    public class Approval
    {
        // MongoDB element name in the database and their mapping to the class properties
        [BsonElement("approvalID")]           
        public int approvalID { get; set; }   

        [BsonElement("approver")]             
        public string approver { get; set; }

        [BsonElement("ticketID")]
        public int ticketID { get; set; }


    }
}
