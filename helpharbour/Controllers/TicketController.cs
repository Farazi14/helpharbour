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

        // Adjust the constructor to include TicketDAO
        public TicketController(TicketDAO ticketDAO)
        {
            _ticketDAO = ticketDAO; // Initialize TicketDAO
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

    }
}
