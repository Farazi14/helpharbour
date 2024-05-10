using helpharbour.DAO;
using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace helpharbour.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAccountController : ControllerBase
    {
        private readonly UserAccountDAO _userAccountDAO; // Injected UserAccountDAO
        private readonly ILogger<UserAccountController> _logger;

        // Adjust the constructor to include UserAccountDAO
        public UserAccountController(UserAccountDAO userAccountDAO, ILogger<UserAccountController> logger)
        {
            _userAccountDAO = userAccountDAO; // Initialize UserAccountDAO
            _logger = logger;  // adding logger to track user account authenication operations
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserAccount>> Get() 
        {
            try
            {
                var userAccounts = _userAccountDAO.GetAllUserAccounts();
                return Ok(userAccounts); // Return the userAccounts with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to get a user account by ID
        [HttpGet("{userID}")]
        public ActionResult<UserAccount> Get(int userID)
        {
            try
            {
                var userAccount = _userAccountDAO.GetUserAccountById(userID);
                if (userAccount == null)
                {
                    return NotFound(); // Return HTTP 404 Not Found if user account is not found
                }
                return Ok(userAccount); // successful response with the user account
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        [HttpPost]
        public ActionResult<UserAccount> Post([FromBody] UserAccount newUserAccount)
        {
            try
            {
                var create_UserAccount = _userAccountDAO.AddUserAccount(newUserAccount);
                return Ok(create_UserAccount); // Return the created user account with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        [HttpPut("{userID}")]
        public ActionResult Put(int userID, [FromBody] UserAccount userAccount)
        {
            try
            {
                _userAccountDAO.UpdateUserAccount(userID, userAccount);
                return Ok(); // Return HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        [HttpDelete("{userID}")]
        public ActionResult Delete(int userID)
        {
            try
            {
                _userAccountDAO.DeleteUserAccount(userID);
                return Ok(); // Return HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // implement the authenticate method
        [HttpPost("authenticate")]
        public ActionResult<UserAccount> Authenticate([FromBody] UserCredentials credentials)   // CHANGE THE PARAMETER TO UserCredentials and added UserCredentials model
        {
            _logger.LogInformation("Authenticate method called"); // log the method call
            
            try
            {
                var userAccount = _userAccountDAO.Authenticate(credentials.username, credentials.password);  // VERIFY THE USERNAME AND PASSWORD TO BE CORRECT PROPERTIES
                
                if (userAccount == null)
                {
                    return Unauthorized("Username or password is incorrect");
                }

               return Ok(userAccount);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        //Implemetation to get all admins
        [HttpGet("admins")]
        public ActionResult<IEnumerable<UserAccount>> GetAdmins()
        {
            try
            {
                var admins = _userAccountDAO.GetAdmins();
                return Ok(admins); // Return the admins with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        //Implementation to get all technicians
        [HttpGet("technicians")]
        public ActionResult<IEnumerable<UserAccount>> GetTechnicians()
        {
            try
            {
                var technicians = _userAccountDAO.GetTechnicians();
                return Ok(technicians); // Return the technicians with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }
    }
}
