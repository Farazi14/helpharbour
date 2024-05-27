using MongoDB.Bson;                                 // MongoDB types for BsonDocument
using MongoDB.Bson.Serialization.Attributes;        // MongoDB serialization attributes for the class properties 

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]                       // Ignore extra elements in the database
    public class UserAccount
    {
        // MongoDB element name in the database and their mapping to the class properties
        [BsonElement("userID")]
        public int userID { get; set; }

        [BsonElement("username")]
        public string username { get; set; }

        [BsonElement("password")]
        public string password { get; set; }

        [BsonElement("role")]
        public string role { get; set; }

        [BsonElement("groupName")]
        public string groupName { get; set; }   
       
    }
}
