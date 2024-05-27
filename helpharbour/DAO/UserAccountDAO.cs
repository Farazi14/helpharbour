using helpharbour.Model;
using helpharbour.Services;
using MongoDB.Driver;


namespace helpharbour.DAO
{
    public class UserAccountDAO
    {

        private IMongoCollection<UserAccount> userAccount_Collection;
        private readonly ILogger<UserAccountDAO> _logger;                                                                                                       // adding logger to track user account authenication operations

        public UserAccountDAO(MongoDBConnection mongoDBConnection, ILogger<UserAccountDAO> logger)
        {
            userAccount_Collection = mongoDBConnection.GetDatabase().GetCollection<UserAccount>("user_account");
            _logger = logger;
        }

        public List<UserAccount> GetAllUserAccounts()
        {
            return userAccount_Collection.Find(userAccount => true).ToList();                                                                                   // return all user accounts
        }

        public UserAccount GetUserAccountById(int userID)
        {
            return userAccount_Collection.Find(userAccount => userAccount.userID == userID).FirstOrDefault();                                                   // return user account by ID
        }

              
        public UserAccount Authenticate(string username, string password)
        {
            _logger.LogInformation($"Received username: {username}");  
            _logger.LogInformation($"Received password: {password}");

            var userAccount = userAccount_Collection.Find<UserAccount>(user => user.username == username && user.password == password).FirstOrDefault();        // find user account by username and password

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

        // method to get all admins
        public List<UserAccount> GetAdmins()
        {
            return userAccount_Collection.Find(userAccount => userAccount.role == "administrator").ToList();
        }

        // method to get technicians
        public List<UserAccount> GetTechnicians()
        {
            return userAccount_Collection.Find(userAccount => userAccount.role == "Technician").ToList();
        }
    }
}
