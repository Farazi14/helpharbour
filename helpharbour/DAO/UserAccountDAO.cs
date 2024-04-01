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

        public UserAccount AddUserAccount(UserAccount newUserAccount)
        {
            // increment the userID to ensure uniqueness
            var largestUserID = userAccount_Collection
                              .Find(userAccount => true)
                              .SortByDescending(userAccount => userAccount.userID)
                              .Limit(1)
                              .FirstOrDefault()?.userID ?? 0;

            newUserAccount.userID = largestUserID + 1;

            userAccount_Collection.InsertOne(newUserAccount);
            return newUserAccount;
        }

        
        public void UpdateUserAccount(int userID, UserAccount userAccount)
        {
            userAccount_Collection.ReplaceOne(u => u.userID == userID, userAccount);
        }

        public void DeleteUserAccount(int userID)
        {
            userAccount_Collection.DeleteOne(userAccount => userAccount.userID == userID);
        }

    }
}
