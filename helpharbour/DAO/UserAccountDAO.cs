using helpharbour.Model;
using helpharbour.Services;
using MongoDB.Driver;


namespace helpharbour.DAO
{
    public class UserAccountDAO
    {

        private IMongoCollection<UserAccount> userAccount_Collection;
        private readonly ILogger<UserAccountDAO> _logger; // adding logger to track user account authenication operations

        public UserAccountDAO(MongoDBConnection mongoDBConnection, ILogger<UserAccountDAO> logger)
        {
            userAccount_Collection = mongoDBConnection.GetDatabase().GetCollection<UserAccount>("user_account");
            _logger = logger;
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
        public UserAccount Authenticate(string username, string password)
        {
            _logger.LogInformation($"Received username: {username}");  
            _logger.LogInformation($"Received password: {password}");

            var userAccount = userAccount_Collection.Find<UserAccount>(user => user.username == username && user.password == password).FirstOrDefault();

            if (userAccount != null)
            {
                _logger.LogInformation($"user account found");
                userAccount.password = null;
            }
            else
            {
                _logger.LogInformation($"user account does not exist");
            }

           
            return userAccount;
        }
    }
}
