using MongoDB.Bson.Serialization.Attributes;

namespace helpharbour.Model
{
    [BsonIgnoreExtraElements]
    public class Users
    {

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
