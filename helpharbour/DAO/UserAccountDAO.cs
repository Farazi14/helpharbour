using helpharbour.Model;
using helpharbour.Services;
using MongoDB.Driver;

namespace helpharbour.DAO
{
    public class UserAccountDAO
    {

        private IMongoCollection<UserAccount> userAccount_Collection;

        public UserAccountDAO(MongoDBConnection mongoDBConnection)
        {
            userAccount_Collection = mongoDBConnection.GetDatabase().GetCollection<UserAccount>("user_account");
        }

        public List<UserAccount> GetAllUserAccounts()
        {
            return userAccount_Collection.Find(userAccount => true).ToList();
        }

        public UserAccount GetUserAccountById(int userID)
        {
            return userAccount_Collection.Find(userAccount => userAccount.userID == userID).FirstOrDefault();
        }

    }
}
