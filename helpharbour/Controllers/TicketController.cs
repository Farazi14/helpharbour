using helpharbour.DAO;
using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;


namespace helpharbour.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly TicketDAO _ticketDAO; // Injected TicketDAO
        private readonly ILogger<UserAccountController> _logger;

        // Adjust the constructor to include TicketDAO
        public TicketController(TicketDAO ticketDAO, ILogger<UserAccountController> logger)
        {
            _ticketDAO = ticketDAO; // Initialize TicketDAO
            _logger = logger;  // adding logger to track ticket operations
        }

        [HttpGet]
        public ActionResult<IEnumerable<ticket>> Get() // Ensure the return type matches your model because of <ticket> in the ActionResult
        {
            try
            {
                var tickets = _ticketDAO.GetAllTickets();
                return Ok(tickets); // Return the tickets with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to get a ticket by ID
        [HttpGet("{ticketId}")]
        public ActionResult<ticket> Get(int ticketId)
        {
            try
            {
                var ticket = _ticketDAO.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound(); // Return HTTP 404 Not Found if ticket is not found
                }
                return Ok(ticket); // successful response with the ticket
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }


        // Implementation to add a ticket
        [HttpPost]
        public ActionResult<ticket> Post([FromBody] ticket newTicket)
        {
            _logger.LogInformation("Adding a new ticket");
            _logger.LogInformation("Ticket : " + newTicket);

            try
            {
                var create_Ticket = _ticketDAO.AddTicket(newTicket);
                return CreatedAtAction(nameof(Get), new { id = create_Ticket.ticketID }, create_Ticket); 
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); 
            }
        }

        // Implementation to update a ticket modified to update only the status
        [HttpPut("{ticketId}/status")]
        public ActionResult<ticket> UpdateTicketStatus(int ticketId, [FromBody] TicketStatusUpdate updateStatus)
        {
            
            try
            {
                var ticket = _ticketDAO.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound();
                }
                //updatedTicket.ticketID = ticketId;  

                ticket.status = updateStatus.status; // Update only the status
                var updatedTicket = _ticketDAO.UpdateTicket(ticketId, ticket);
                return Ok(updatedTicket); 
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); 
            }
        }

        // Implementation to delete a ticket
        [HttpDelete("{ticketId}")]
        public ActionResult Delete(int ticketId)
        {
            try
            {
                var ticket = _ticketDAO.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound(); 
                }
                _ticketDAO.DeleteTicket(ticketId);
                return NoContent(); // Return HTTP 204 No Content
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); 
            }
        }

        // Implementation to get all tickets by a user
        [HttpGet("user/{userId}")]
                public ActionResult<List<ticket>> GetTicketsByUserId(string userId)
        {
            try
            {
                var tickets = _ticketDAO.GetTicketsByUserId(userId);
                if (tickets == null) return NotFound("No tickets found for the user.");
                return Ok(tickets);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
            }
}
