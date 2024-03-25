using helpharbour.DAO;
using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace helpharbour.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketController : ControllerBase
    {
        

        private readonly ILogger<TicketController> _logger;
        private readonly TicketDAO _ticketDAO; // Injected TicketDAO

        // Adjust the constructor to include TicketDAO
        public TicketController(ILogger<TicketController> logger, TicketDAO ticketDAO)
        {
            _logger = logger;
            _ticketDAO = ticketDAO; // Initialize TicketDAO
        }


        [HttpGet]
       public ActionResult<IEnumerable<ticket>> Get() // Ensure the return type matches your model
        {
            try
            {
                var tickets = _ticketDAO.GetAllTickets();
                return Ok(tickets); // Return the tickets with HTTP 200 OK
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching tickets.");
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }
    }
}